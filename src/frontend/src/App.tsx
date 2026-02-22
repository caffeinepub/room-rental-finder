import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import RoomDetailPage from './pages/RoomDetailPage';
import AddListingPage from './pages/AddListingPage';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const roomDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room/$id',
  component: RoomDetailPage,
});

const addListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-listing',
  component: AddListingPage,
});

const routeTree = rootRoute.addChildren([indexRoute, roomDetailRoute, addListingRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
