import {Route} from '@angular/router';

export const featureLoginRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  }
];
