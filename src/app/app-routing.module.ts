import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { AboutComponent } from './shared/components/about/about.component';
import { adminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    data: { preload: true },
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart.module').then((m) => m.CartModule),
    data: { preload: true },
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
    // Temporarily remove auth guard for testing
    // canActivate: [AuthGuard],
    data: {
      preload: true,
      expectedRole: 'user',
    },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [adminGuard],
    data: {
      preload: true,
    },
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.module').then(
        (m) => m.ProductsModule
      ),
    data: { preload: true },
  },
 
  {
    path: 'checkout',
    loadChildren: () =>
      import('./features/checkout/checkout.module').then(
        (m) => m.CheckoutModule
      ),
    data: { preload: true },
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'not-found',
    component: NotfoundComponent,
  },
  {
    path: '**',
    redirectTo: '/not-found',
    component: NotfoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Enable router preloading for better performance
      preloadingStrategy: PreloadAllModules,

      // Enable tracing for debugging (disable in production)
      enableTracing: true,

      // Optimize initial navigation
      initialNavigation: 'enabledBlocking',

      // Use hash location strategy for better compatibility (optional)
      // useHash: false,

      // Optimize scroll behavior
      scrollPositionRestoration: 'top',

      // Optimize anchor scrolling
      anchorScrolling: 'enabled',

      // OnSameUrlNavigation strategy
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
