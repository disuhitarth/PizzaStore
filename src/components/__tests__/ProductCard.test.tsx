import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ProductCard from '../ProductCard';

const addItemMock = vi.fn();

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    addItem: addItemMock,
  }),
}));

// Dialog and motion components are reasonably test-friendly as-is, so we use real ones.

describe('ProductCard', () => {
  beforeEach(() => {
    addItemMock.mockReset();
  });

  it('handleAdd correctly adds an item with selected customizations and calculated total price', async () => {
    const user = userEvent.setup();

    render(
      <ProductCard
        name="Custom Delight"
        price="$10.00"
        description="Test pizza"
        image="https://example.com/pizza.jpg"
      />,
    );

    // Open customization dialog
    await user.click(screen.getByRole('button', { name: /custom delight/i }));

    // Pick a topping in the default "Meat Toppings" category.
    // Use "Pepperoni" explicitly so we can assert on the topping name.
    const pepperoniLabel = await screen.findByText('Pepperoni');
    const pepperoniRow = pepperoniLabel.parentElement?.parentElement as HTMLElement;
    const wholeButton = within(pepperoniRow).getByLabelText('Whole');
    await user.click(wholeButton);

    // Expect topping counter to reflect 1 unit selected (1 x whole topping)
    expect(screen.getByText('1.0 / 7 toppings')).toBeInTheDocument();

    // With base price 10.00 and TOPPING_SURCHARGE 1.59 for one topping:
    // per-item price should be 11.59, so the CTA should show total 11.59 for quantity 1.
    expect(
      screen.getByRole('button', { name: /add to order • \$11\.59/i }),
    ).toBeInTheDocument();

    // Click "Add to order" – this invokes handleAdd
    await user.click(screen.getByRole('button', { name: /add to order/i }));

    expect(addItemMock).toHaveBeenCalledTimes(1);
    const addedItem = addItemMock.mock.calls[0][0];

    expect(addedItem).toMatchObject({
      name: 'Custom Delight',
      price: 11.59,
      quantity: 1,
      size: '11"',
      toppings: ['Pepperoni'],
      image: 'https://example.com/pizza.jpg',
    });

    // Non "Make Your Own" pizzas default to Regular crust and Regular Sauce
    expect(addedItem.specialInstructions).toContain('Crust: Regular');
    expect(addedItem.specialInstructions).toContain('Sauce: Regular Sauce');
  });

  it('resetState for specialty pizzas loads default toppings and marks recipe as recommended', async () => {
    const user = userEvent.setup();

    // "Hawaiian Pizza" maps to the "Hawaiian" specialty pizza in pizzaConfig
    render(
      <ProductCard
        name="Hawaiian Pizza"
        price="$12.00"
        description="Hawaiian specialty"
        image="https://example.com/hawaiian.jpg"
      />,
    );

    // Open dialog; resetState is invoked via useEffect for specialty pizzas
    await user.click(screen.getByRole('button', { name: /hawaiian pizza/i }));

    // The helper text indicates whether we are still on the recommended recipe
    expect(
      await screen.findByText('Using recommended recipe toppings'),
    ).toBeInTheDocument();

    // Hawaiian specialty in pizzaConfig has 3 default toppings, each placed as Whole (1 unit).
    // The counter should therefore show 3.0 / 7 toppings.
    expect(screen.getByText('3.0 / 7 toppings')).toBeInTheDocument();
  });

  it('topping placement and selection logic updates counts and enforces topping limit', async () => {
    const user = userEvent.setup();

    render(
      <ProductCard
        name="Limit Test Pizza"
        price="$10.00"
        description="Limit test"
        image="https://example.com/limit.jpg"
      />,
    );

    await user.click(screen.getByRole('button', { name: /limit test pizza/i }));

    // Initially no toppings selected
    expect(screen.getByText('0.0 / 7 toppings')).toBeInTheDocument();

    // Toggle a single topping on and off via "Whole" placement
    const pepperoniLabel = await screen.findByText('Pepperoni');
    const pepperoniRow = pepperoniLabel.parentElement?.parentElement as HTMLElement;
    const pepperoniWhole = within(pepperoniRow).getByLabelText('Whole');

    await user.click(pepperoniWhole);
    expect(screen.getByText('1.0 / 7 toppings')).toBeInTheDocument();

    // Clicking the same placement again should deselect the topping
    await user.click(pepperoniWhole);
    expect(screen.getByText('0.0 / 7 toppings')).toBeInTheDocument();

    // Now verify the global topping limit (7 units) is enforced.
    const meatToppings = [
      'Achari Chicken',
      'Pepperoni',
      'Ham',
      'Bacon Bits',
      'Bacon Strips',
      'Ground Beef',
      'Salami',
      'Mild Sausage',
    ];

    // Turn on the first 7 meat toppings as Whole (1 unit each) => 7 units total
    for (let i = 0; i < 7; i++) {
      const label = await screen.findByText(meatToppings[i]);
      const row = label.parentElement?.parentElement as HTMLElement;
      const whole = within(row).getByLabelText('Whole');
      await user.click(whole);
    }

    expect(screen.getByText('7.0 / 7 toppings')).toBeInTheDocument();

    // Attempt to add an 8th whole topping – this should be rejected by the limit check
    const extraLabel = await screen.findByText(meatToppings[7]);
    const extraRow = extraLabel.parentElement?.parentElement as HTMLElement;
    const extraWhole = within(extraRow).getByLabelText('Whole');
    await user.click(extraWhole);

    // Still capped at 7
    expect(screen.getByText('7.0 / 7 toppings')).toBeInTheDocument();
  });
});
