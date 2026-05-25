import { createBrowserRouter } from 'react-router-dom';
import { UsersPage } from './modules/users/presentation/pages/UsersPage';

export const router = createBrowserRouter([
  { path: '/', element: <div>Home</div> },
  { path: '/users', element: <UsersPage /> },
]);
