export const loginRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('@login/login.component').then((c) => c.LoginComponent),
  },
];
