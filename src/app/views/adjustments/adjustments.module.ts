import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AdjustmentsComponent } from './adjustments.component';
import { InsertAdjustmentComponent } from './insert.component';
import { UpdateAdjustmentComponent } from './update.component';
import { AdjustmentsRoutingModule } from './adjustments-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        AdjustmentsRoutingModule,
        ChartsModule,
        BsDropdownModule,
        NgxDatatableModule,
        ButtonsModule.forRoot(),
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        AdjustmentsComponent,
        InsertAdjustmentComponent,
        UpdateAdjustmentComponent
    ]
})
export class AdjustmentsModule {}