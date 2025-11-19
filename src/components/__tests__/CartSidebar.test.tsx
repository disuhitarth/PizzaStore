import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CartSidebar from '../CartSidebar';

const addItemMock = vi.fn();

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    items: [
      {
        id: 'existing',
        name: 'Existing Item',
        price: 9.99,
        quantity: 1,
        size: 'Large',
        toppings: [],
      },
    ],
    addItem: addItemMock,
    updateQuantity: vi.fn(),
    getTotalPrice: () => 9.99,
    getTotalItems: () => 1,
    removeItem: vi.fn(),
    clearCart: vi.fn(),
  }),
}));

// Simplify common components used in the sidebar
vi.mock('@/components/common', () => ({
  CartItemDisplay: ({ item }: any) => <div data-testid="cart-item">{item.name}</div>,
  ContactInput: ({ value, onChange }: any) => (
    <input
      data-testid="contact-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('CartSidebar', () => {
  beforeEach(() => {
    addItemMock.mockReset();
  });

  it('handleAddSuggestion adds a predefined suggestion to the cart', async () => {
    const user = userEvent.setup();

    render(<CartSidebar open={true} onOpenChange={vi.fn()} />);

    // The suggestion button should be visible when there is at least one cart item
    const suggestionButton = await screen.findByRole('button', {
      name: /creamy garlic/i,
    });

    await user.click(suggestionButton);

    expect(addItemMock).toHaveBeenCalledTimes(1);
    const added = addItemMock.mock.calls[0][0];

    expect(added).toMatchObject({
      name: 'Creamy Garlic',
      price: 1.49,
      size: 'Dip',
      toppings: [],
      specialInstructions: '',
    });
  });
});
