import ClarityPage from './pages/ClarityPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Clarity',
    path: '/',
    element: <ClarityPage />
  }
];

export default routes;
