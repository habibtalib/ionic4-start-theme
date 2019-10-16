import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'home-results', loadChildren: './pages/home-results/home-results.module#HomeResultsPageModule' },
  { path: 'scanner', loadChildren: './pages/scanner/scanner.module#ScannerPageModule' },
  { path: 'genealogy', loadChildren: './pages/genealogy/genealogy.module#GenealogyPageModule' },
  { path: 'cart', loadChildren: './pages/cart/cart.module#CartPageModule' },
  { path: 'orders', loadChildren: './pages/orders/orders.module#OrdersPageModule' },
  { path: 'history', loadChildren: './pages/history/history.module#HistoryPageModule' },
  { path: 'invite', loadChildren: './pages/invite/invite.module#InvitePageModule' },
  { path: 'merchandise', loadChildren: './pages/merchandise/merchandise.module#MerchandisePageModule' },
  { path: 'products', loadChildren: './pages/products/products.module#ProductsPageModule' },
  { path: 'checkout', loadChildren: './pages/checkout/checkout.module#CheckoutPageModule' },
  { path: 'user/:id', loadChildren: './pages/user/user.module#UserPageModule' },
  { path: 'order/:id', loadChildren: './pages/order/order.module#OrderPageModule' },
  { path: 'scan-order/:id', loadChildren: './pages/scan-order/scan-order.module#ScanOrderPageModule' },
  { path: 'history-detail/:id', loadChildren: './pages/history-detail/history-detail.module#HistoryDetailPageModule' },
  { path: 'inbox', loadChildren: './pages/inbox/inbox.module#InboxPageModule' },
  { path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'message/:id', loadChildren: './pages/message/message.module#MessagePageModule' },
  { path: 'forget-password', loadChildren: './pages/forget-password/forget-password.module#ForgetPasswordPageModule' },
  { path: 'serial-list/:id', loadChildren: './pages/serial-list/serial-list.module#SerialListPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
