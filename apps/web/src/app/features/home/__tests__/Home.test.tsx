import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';

import { HomePage } from '../Home';

import { render, screen } from '@testing-library/react';

vi.mock('@/app/core/auth', () => ({
  useAuth: () => ({
    user: { name: 'María', username: 'maria', email: null, role: 'USER', avatarUrl: null },
  }),
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

describe('HomePage', () => {
  it('muestra el nombre del usuario autenticado', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('María')).toBeInTheDocument();
  });
});
