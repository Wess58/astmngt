import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsListComponent } from './components/assets/assets-list/assets-list.component';
import { LocationsComponent } from './components/locations/locations.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CategoriesComponent } from './components/assets/categories/categories.component';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { RoleMatrixComponent } from './components/role-matrix/role-matrix.component';
import { LoginComponent } from './auth/login/login.component';
import { AssetsDetailComponent } from './components/assets/assets-detail/assets-detail.component';
import { SetPasswordComponent } from './auth/set-password/set-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/assets',
    pathMatch: 'full'
  },
  {
    path: 'assets',
    component: AssetsListComponent
  },
  {
    path: 'asset/:id',
    component: AssetsDetailComponent
  },
  {
    path: 'locations',
    component: LocationsComponent
  },
  {
    path: 'departments',
    component: DepartmentsComponent
  },
  {
    path: 'asset-categories',
    component: CategoriesComponent
  },
  {
    path: 'user-management',
    component: UsersManagementComponent
  },
  {
    path: 'role-matrix',
    component: RoleMatrixComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  // {
  //   path: 'login',
  //   loadComponent: () =>
  //     import('../app/auth/login/login.component').then(m => m.LoginComponent),
  // },
  {
    path: 'reset-password/start',
    component: SetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
