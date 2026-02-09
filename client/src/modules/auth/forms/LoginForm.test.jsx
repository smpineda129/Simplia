import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import { useAuth } from '../../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth');

describe('LoginForm', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      login: mockLogin,
    });
    mockLogin.mockClear();
  });

  test('renders email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    // Material UI renders multiple elements with the label text (label + legend), so we check that at least one exists
    expect(screen.getAllByLabelText(/Contraseña/i).length).toBeGreaterThan(0);
  });

  test('password visibility toggle has accessible name', () => {
    render(<LoginForm />);
    // Check for the show password button
    const showButton = screen.getByLabelText(/mostrar contraseña/i);
    expect(showButton).toBeInTheDocument();

    // Click it
    fireEvent.click(showButton);

    // Now it should be hide password
    const hideButton = screen.getByLabelText(/ocultar contraseña/i);
    expect(hideButton).toBeInTheDocument();
  });

  test('shows loading spinner when submitting', async () => {
    // Make login return a promise that takes some time
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
    // Use getAllByLabelText because Material UI renders a label and a legend, potentially confusing the query
    // or simply filter by tag 'input'
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
    const passwordInput = passwordInputs.find(el => el.tagName === 'INPUT');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    // Look for the CircularProgress (progressbar role)
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});
