import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserComponent } from './components/admin-panel/manage-user/manage-user.component';
import { RoomMeetingComponent } from './components/examinee-proctor-room/room-meeting/room-meeting.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login-user/login.component';
import { RegisterComponent } from './components/register-user/register.component';
import { AdminGuard } from './Account-guards/admin.guard';
import { AuthGuard } from './Account-guards/auth.guard';
import { PreventUnsavedChangesGuard } from './Account-guards/prevent-unsaved-changes.guard';
import { VideoBoxUserComponent } from './components/video-box-user/video-box-user.component';


const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RoomMeetingComponent },
      { path: 'room', component: RoomMeetingComponent },
      { path: 'home/:id', component: HomeComponent, canDeactivate: [PreventUnsavedChangesGuard] },
      { path: 'manage-user', component: ManageUserComponent, canActivate: [AdminGuard] },
      { path: 'video-box', component: VideoBoxUserComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
