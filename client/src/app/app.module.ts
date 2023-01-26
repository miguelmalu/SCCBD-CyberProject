import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { TruncatePipePipe } from './pipes/truncate-pipe.pipe';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { ListRolesComponent } from './components/list-roles/list-roles.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { JwtInterceptorInterceptor } from './interceptors/jwt-interceptor.interceptor';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { FilesComponent } from './components/files/files.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    ListUsersComponent,
    NavigationComponent,
    ListUsersComponent,
    TruncatePipePipe,
    LoginUserComponent,
    ListRolesComponent,
    CreateRoleComponent,
    RegisterUserComponent,
    FilesComponent,
    PermissionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    MatIconModule,
    MatProgressBarModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
