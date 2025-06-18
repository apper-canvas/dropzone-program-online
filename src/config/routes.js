import HomePage from '@/components/pages/HomePage';

export const routes = {
  home: {
    id: 'home',
    label: 'DropZone',
    path: '/',
    icon: 'Upload',
    component: HomePage
  }
};

export const routeArray = Object.values(routes);
export default routes;