import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/pages/login/login.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HeaderComponent } from './components/common/header/header.component';
import { LoaderComponent } from './components/common/loader/loader.component';
import { ChatWidgetComponent } from './components/common/chat-widget/chat-widget.component';
import { NavigationWidgetComponent } from './components/common/navigation-widget/navigation-widget.component';
import { AccountComponent } from './components/pages/account/account.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EventsComponent } from './components/pages/events/events.component';
import { MapComponent } from './components/pages/map/map.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { WeatherComponent } from './components/common/weather/weather.component';
import { TimelineComponent } from './components/pages/profile/timeline/timeline.component';
import { AboutComponent } from './components/pages/profile/about/about.component';
import { PhotosComponent } from './components/pages/profile/photos/photos.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProfileInfoComponent } from './components/pages/account/profile-info/profile-info.component';
import { ProfileSocialComponent } from './components/pages/account/profile-social/profile-social.component';
import { ChangePasswordComponent } from './components/pages/account/change-password/change-password.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoComponent } from './components/pages/account/demo/demo.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ImageCropperModule } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';
import { PostComponent } from './components/common/post/post.component';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { OwlTooltipModule } from 'owl-ng';
import { WindyComponent } from './components/pages/windy/windy.component';
import { PropretiesPipe } from './pipes/propreties.pipe';
import { BoatsComponent } from './components/pages/boats/boats.component';
import { HebergementsComponent } from './components/pages/hebergements/hebergements.component';
import { EquipmentsComponent } from './components/pages/equipments/equipments.component';
import { EquipmentListComponent } from './components/pages/equipments/equipment-list/equipment-list.component';
import { CategoriesComponent } from './components/pages/equipments/categories/categories.component';
import { SearchComponent } from './components/pages/search/search.component';
import { HebergementListComponent } from './components/common/hebergement-list/hebergement-list.component';
import { BoatsListComponent } from './components/common/boats-list/boats-list.component';
import { NotificationsComponent } from './components/pages/notifications/notifications.component';
import { MapBoxComponent } from './components/common/map-box/map-box.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ActivateAccountComponent } from './components/pages/activate-account/activate-account.component';
import { PasswordResetComponent } from './components/pages/password-reset/password-reset.component';
import { PasswordResetRequestComponent } from './components/pages/password-reset-request/password-reset-request.component';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { AdminComponent } from './components/pages/admin/admin.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { DatePipe } from '@angular/common';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    LoaderComponent,
    ChatWidgetComponent,
    NavigationWidgetComponent,
    AccountComponent,
    LayoutComponent,
    EventsComponent,
    MapComponent,
    ProfileComponent,
    WeatherComponent,
    TimelineComponent,
    AboutComponent,
    PhotosComponent,
    ProfileInfoComponent,
    ProfileSocialComponent,
    ChangePasswordComponent,
    DemoComponent,
    PostComponent,
    TimeAgoPipe,
    WindyComponent,
    PropretiesPipe,
    BoatsComponent,
    HebergementsComponent,
    EquipmentsComponent,
    EquipmentListComponent,
    CategoriesComponent,
    SearchComponent,
    HebergementListComponent,
    BoatsListComponent,
    NotificationsComponent,
    MapBoxComponent,
    ActivateAccountComponent,
    PasswordResetComponent,
    PasswordResetRequestComponent,
    AdminComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          let access_token = localStorage.getItem("acessToken");
          return access_token;
        },
        allowedDomains: [environment.apiDomain],
        disallowedRoutes: ["http://localhost:3000/auth/signin"]
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlTooltipModule,
    ImageCropperModule,
    NgxLinkifyjsModule.forRoot(),
    Ng5SliderModule,
    NgImageFullscreenViewModule,
    NgbModule
  ],

  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
