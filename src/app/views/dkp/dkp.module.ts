// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SummaryComponent } from './summary.component';
import { ClassCardComponent } from './classcard.component';

// Theme Routing
import { DkpRoutingModule } from './dkp-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgxDatatableModule,
        DkpRoutingModule
    ],
    declarations: [
        SummaryComponent,
        ClassCardComponent
    ]
})
export class DkpModule {}