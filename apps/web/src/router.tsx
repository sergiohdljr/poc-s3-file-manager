import { createBrowserRouter } from 'react-router-dom';
import { FilesPage } from './modules/users/presentation/pages/Files';

export const router = createBrowserRouter([
  { path: '/', element: <div>Home</div> },
  { path: '/files', element: <FilesPage /> },
]);
