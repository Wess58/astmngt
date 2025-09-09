import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { PathLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { HttpTokenInterceptor } from './interceptors/http.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { LoginComponent } from './auth/login/login.component';
import { AssetsListComponent } from './components/assets/assets-list/assets-list.component';
import { AssetsDetailComponent } from './components/assets/assets-detail/assets-detail.component';
import { AppTooltipDirective } from './directives/app-tooltip.directive';
import { ImageFallbackDirective } from './directives/image-fallback.directive';
import { ToastComponent } from './shared/toast/toast.component';
import { NgmodelDebounceDirective } from './directives/ngmodel-debounce.directive';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RoleMatrixComponent } from './components/role-matrix/role-matrix.component';
import { FormatNavTitlePipe } from './pipes/format-nav-title.pipe';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { LocationsComponent } from './components/locations/locations.component';
import { CategoriesComponent } from './components/assets/categories/categories.component';
import { HasOperationDirective } from './directives/has-operation.directive';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { SanitizeFileUrlPipe } from './pipes/sanitize-file-url.pipe';
import { FileSizePipe } from './pipes/file-size.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ChildDetailsComponent } from './components/assets/child-details/child-details.component';
import { InputCommaFormatDirective } from './directives/input-comma-format.directive';
import { AssetCreateComponent } from './components/assets/asset-create/asset-create.component';


@NgModule({
  declarations: [
    AppComponent,
    AppTooltipDirective,
    NgmodelDebounceDirective,
    ImageFallbackDirective,
    NavbarComponent,
    ToastComponent,
    FooterComponent,
    UsersManagementComponent,
    LoginComponent,
    AssetsListComponent,
    AssetsDetailComponent,
    RoleMatrixComponent,
    FormatNavTitlePipe,
    SideNavComponent,
    DepartmentsComponent,
    LocationsComponent,
    CategoriesComponent,
    HasOperationDirective,
    ImageFallbackDirective,
    ImageUploadComponent,
    SanitizeFileUrlPipe,
    FileSizePipe,
    ClickOutsideDirective,
    ChildDetailsComponent,
    InputCommaFormatDirective,
    AssetCreateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
