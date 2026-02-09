import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import authService from './modules/auth/services/authService';

// Mock modules
jest.mock('./modules/auth/services/authService', () => ({
  getCurrentUser: jest.fn(),
  login: jest.fn(),
}));

jest.mock('./modules/auth/pages/LoginPage', () => () => <div>Login Page</div>);
jest.mock('./modules/dashboard/pages/DashboardPage', () => () => <div>Dashboard Page</div>);
jest.mock('./components/LoadingSpinner', () => ({ message }) => <div>Loading: {message}</div>);

describe('App Smoke Test', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders loading state initially if token exists', () => {
    // Set token to trigger checkAuth
    localStorage.setItem('accessToken', 'fake-token');

    // Return a promise that never resolves to keep it loading
    authService.getCurrentUser.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders login page when not authenticated (no token)', async () => {
    // No token in localStorage by default

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});
