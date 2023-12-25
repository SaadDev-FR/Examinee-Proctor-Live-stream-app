import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login-user/login.component';
import { RegisterComponent } from './components/register-user/register.component';
import { VideoBoxUserComponent } from './components/video-box-user/video-box-user.component';
import { ConfirmDialogComponent } from './components/modals/alert-dialog/confirm-dialog.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

import { ChatGroupComponent } from './components/chat-group/chat-group.component';

import { APP_INITIALIZER } from '@angular/core';
import { map } from 'rxjs/operators';
import { ConfigService } from './services/ConfigService';
import { ManageUserComponent } from './components/admin-panel/manage-user/manage-user.component';
import { AddRoomModalComponent } from './components/examinee-proctor-room/add-room-modal/add-room-modal.component';
import { RoomMeetingComponent } from './components/examinee-proctor-room/room-meeting/room-meeting.component';
import { EditRoomModalComponent } from './components/examinee-proctor-room/edit-room-modal/edit-room-modal.component';

function initialize(http: HttpClient, config: ConfigService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      http.get('../assets/config.json')
        .pipe(
          map((x: ConfigService) => {
            config.STUN_SERVER = x.STUN_SERVER;
            config.urlTurnServer = x.urlTurnServer;
            config.username = x.username;
            config.password = x.password;
            config.isRecorded = x.isRecorded;
            config.clockRegister = x.clockRegister;
            config.pageSize = x.pageSize;
            resolve(true);
          })
        ).subscribe();
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RoomMeetingComponent,
    VideoBoxUserComponent,
    ConfirmDialogComponent,
    HasRoleDirective,
    ChatGroupComponent,
    AddRoomModalComponent,
    EditRoomModalComponent,
    ManageUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left'
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [
        HttpClient,
        ConfigService
      ],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
