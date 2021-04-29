import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AccountComponent } from './components/pages/account/account.component';
import { DemoComponent } from './components/pages/account/demo/demo.component';
import { ActivateAccountComponent } from './components/pages/activate-account/activate-account.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { BoatsComponent } from './components/pages/boats/boats.component';
import { CategoriesComponent } from './components/pages/equipments/categories/categories.component';
import { EquipmentListComponent } from './components/pages/equipments/equipment-list/equipment-list.component';
import { EquipmentsComponent } from './components/pages/equipments/equipments.component';
import { EventsComponent } from './components/pages/events/events.component';
import { HebergementsComponent } from './components/pages/hebergements/hebergements.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { MapComponent } from './components/pages/map/map.component';
import { PasswordResetRequestComponent } from './components/pages/password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './components/pages/password-reset/password-reset.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { WindyComponent } from './components/pages/windy/windy.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'admin',
        component: AdminComponent,
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'map',
        component: MapComponent
      },
      {
        path: 'weather',
        component: WindyComponent
      },
      {
        path: 'boats',
        component: BoatsComponent
      },
      {
        path: 'homes',
        component: HebergementsComponent
      },
      {
        path: 'equipments',
        component: EquipmentsComponent,
        children: [
          {
            path: '',
            component: CategoriesComponent
          },
          {
            path: ':typeId',
            component: EquipmentListComponent
          },
          {
            path: '**',
            redirectTo: ''
          }
        ]
      },
      {
        path: 'settings',
        component: AccountComponent
      },
      {
        path: 'settings/:page',
        component: AccountComponent
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'demo',
    component: DemoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activate/:token',
    component: ActivateAccountComponent,
  },
  {
    path: 'password-reset-request',
    component: PasswordResetRequestComponent,
  },
  {
    path: 'reset-password/:token',
    component: PasswordResetComponent,
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
