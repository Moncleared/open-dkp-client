import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';


import { LoadingDataComponent } from './views/utilities/loading-data.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { VerifyComponent } from './views/register/verify.component';
import { ForgotComponent } from './views/register/forgot.component';
import { ProfileComponent } from './views/profile/profilt.component';
import { BaseComponent } from './views/base/base.component';

const APP_CONTAINERS = [
    RootLayoutComponent,
    DefaultLayoutComponent
];

import {
    AppAsideModule,
    AppBreadcrumbModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
} from '@coreui/angular'

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { DkpInfoModalComponent } from './views/modals/dkpinfomodal.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RequestModalComponent } from './views/modals/requestmodal.component';
import { ChatComponent } from './views/chat/chat.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { DkpService } from './services/dkp.service';
import { CognitoUtil } from './services/cognito.service';
import { ClientResolve } from './resolves/client.resolve';
import { RootLayoutComponent } from './containers/default-layout/root-layout.component';
import { ClientSelectComponent } from './views/register/clientselect.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        AppAsideModule,
        AppBreadcrumbModule.forRoot(),
        AppFooterModule,
        AppHeaderModule,
        AppSidebarModule,
        PerfectScrollbarModule,
        NgxDatatableModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        TypeaheadModule.forRoot(),
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        ChartsModule,
        NgxJsonViewerModule
    ],
    declarations: [
        AppComponent,
        ...APP_CONTAINERS,
        P404Component,
        P500Component,
        LoginComponent,
        ChatComponent,
        RegisterComponent,
        VerifyComponent,
        LoadingDataComponent,
        ForgotComponent,
        ProfileComponent,
        DkpInfoModalComponent,
        RequestModalComponent,
        ClientSelectComponent,
        BaseComponent
    ],
    entryComponents: [
        DkpInfoModalComponent,
        RequestModalComponent
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy },
        CookieService,
        DkpService,
        CognitoUtil,
        ClientResolve],
    bootstrap: [AppComponent]
})
export class AppModule {}