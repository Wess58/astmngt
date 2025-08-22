import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsListComponent } from './components/assets/assets-list/assets-list.component';
import { LocationsComponent } from './components/locations/locations.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CategoriesComponent } from './components/assets/categories/categories.component';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { RoleMatrixComponent } from './components/role-matrix/role-matrix.component';

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
    path: 'location',
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
