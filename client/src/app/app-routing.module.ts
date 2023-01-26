import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { ListRolesComponent } from './components/list-roles/list-roles.component';
import { UserGuardGuard } from './guards/user-guard.guard';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { FilesComponent } from './components/files/files.component';
import { PermissionsComponent } from './components/permissions/permissions.component';

// Routes
const routes: Routes = [
  { path: '', redirectTo: '/files', pathMatch: 'full'},
  { path: 'login-user', component: LoginUserComponent},
  { path: 'register-user', component: RegisterUserComponent},
  { path: 'list-users', component: ListUsersComponent, canActivate: [UserGuardGuard]},
  { path: 'create-user', component: CreateUserComponent, canActivate: [UserGuardGuard]},
  { path: 'edit-user/:name', component: CreateUserComponent, canActivate: [UserGuardGuard]},
  { path: 'create-role', component: CreateRoleComponent, canActivate: [UserGuardGuard]},
  { path: 'list-roles', component: ListRolesComponent, canActivate: [UserGuardGuard]},
  { path: 'files', component: FilesComponent, canActivate: [UserGuardGuard]},
  { path: 'permissions', component: PermissionsComponent, canActivate: [UserGuardGuard]},
  { path: '**', redirectTo: '', pathMatch: 'full', canActivate: [UserGuardGuard]} // In case of a wrong URL, the code redirects to the main path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
