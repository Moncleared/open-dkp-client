import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AdminComponent } from './admin.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminRoutingModule } from './admin-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GuildRosterComponent } from './guildroster.component';
import { CognitoComponent } from './cognito.component';
import { AuditComponent } from './audit.component';
import { AuditModalComponent } from '../modals/auditmodal.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        AdminRoutingModule,
        ChartsModule,
        BsDropdownModule,
        NgxDatatableModule,
        TabsModule.forRoot(),
        ButtonsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        NgxJsonViewerModule
    ],
    declarations: [
        AdminComponent,
        GuildRosterComponent,
        CognitoComponent,
        AuditComponent,
        AuditModalComponent
    ],
    entryComponents: [
        AuditModalComponent
    ],
})
export class AdminModule {}