import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { MyeventListComponent } from './myevent-list/myevent-list.component';
import { AccessComponent } from './access/access.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'event-create', component: EventCreateComponent },
  { path: 'event-list', component: EventListComponent },
  { path: 'event-edit/:id', component: EventEditComponent },
  { path: 'event-detail/:id', component: EventDetailComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'myevent-list', component: MyeventListComponent },
  { path: 'event-edit/:id/' + 'access', component: AccessComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
