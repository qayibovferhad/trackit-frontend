import AppLayout from '@/layouts/AppLayout';
import type { RoutesConfig } from '@/shared/types/routes.types';
import { PATHS } from '@/shared/constants/routes';
import { lazy } from 'react';

const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));

const routes: RoutesConfig = [
  {
    path: PATHS.SEARCH,
    element: SearchResultsPage,
    children: [],
    isPrivate: true,
    layout: AppLayout,
  },
];

export default routes;
