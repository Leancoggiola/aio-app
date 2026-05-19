import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';

import { HomePage } from '../../../home.page';

import { render, screen } from '@testing-library/react';

vi.mock('@/core/auth', () => ({
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

  it('muestra un saludo según la hora', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Buenos días|Buenas tardes|Buenas noches/)).toBeInTheDocument();
  });
});
