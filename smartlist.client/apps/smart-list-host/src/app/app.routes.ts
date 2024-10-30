import {Route} from '@angular/router';
import {loadRemoteModule} from "@nx/angular/mf";

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadChildren: () => import('@feature-login').then(m => m.featureLoginRoutes)
  },
  {
    path: 'main',
    loadChildren: () =>
      loadRemoteModule('SmartListMain', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
