import { describe, expect, it, vi } from 'vitest';

import { createMockAuthValue, renderWithProviders } from '@/__tests__/helpers';

import { HomePage } from '../../../home.page';

import { screen } from '@testing-library/react';

vi.mock('@/core/auth', () => ({
  useAuth: () =>
    createMockAuthValue({ user: { name: 'María', username: 'maria', email: null, role: 'USER', avatarUrl: null } }),
}));

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
