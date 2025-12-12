import Home from './pages/Home';
import About from './pages/About';
import Movies from './pages/Movies';
import Music from './pages/Music';
import Games from './pages/Games';
import Login from './pages/Login';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: true
  },
  {
    name: 'Movies',
    path: '/movies',
    element: <Movies />,
    visible: true
  },
  {
    name: 'Music',
    path: '/music',
    element: <Music />,
    visible: true
  },
  {
    name: 'Games',
    path: '/games',
    element: <Games />,
    visible: true
  },
  {
    name: 'About',
    path: '/about',
    element: <About />,
    visible: true
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false
  }
];

export default routes;
