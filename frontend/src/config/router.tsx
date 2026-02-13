/**
 * Router Configuration
 * Central location for all app routes
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomeScreen } from '@/pages/HomeScreen';

// Create router with all routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeScreen />,
  },
  {
    path: '/matches',
    element: <div className="p-8">Matches Screen - Coming Soon</div>,
  },
  {
    path: '/leaderboard',
    element: <div className="p-8">Leaderboard Screen - Coming Soon</div>,
  },
  {
    path: '/teams',
    element: <div className="p-8">Teams Screen - Coming Soon</div>,
  },
  {
    path: '/profile',
    element: <div className="p-8">Profile Screen - Coming Soon</div>,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-h1 text-red-500 mb-4">404</h1>
          <p className="body-large text-dark-text-secondary">Page not found</p>
        </div>
      </div>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
