import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import Header from '../Header';

describe('Header', () => {
  it('triggers onCartClick when cart button is clicked', async () => {
    const user = userEvent.setup();
    const onCartClick = vi.fn();

    render(<Header onCartClick={onCartClick} totalItems={0} />);

    const cartButton = screen.getByRole('button', { name: /view cart/i });
    await user.click(cartButton);

    expect(onCartClick).toHaveBeenCalledTimes(1);
  });

  it('displays totalItems badge when totalItems > 0', () => {
    render(<Header totalItems={5} />);

    // Badge with the total number of items in the cart
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
