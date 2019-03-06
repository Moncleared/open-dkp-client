import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RaidsComponent } from './raids.component';
import { InsertRaidComponent } from './insert.component';
import { TickComponent } from './tick.component';
import { TickModalComponent } from '../modals/tickmodal.component';
import { RaidsRoutingModule } from './raids-routing.module';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { RaidDetailsComponent } from './details.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TickHelperComponent } from './tickhelper.component';
import { CharSelectComponent } from './charselect.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        ChartsModule,
        BsDropdownModule,
        TypeaheadModule,
        ButtonsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AccordionModule.forRoot(),
        TabsModule.forRoot(),
        NgxDatatableModule,
        RaidsRoutingModule,
    ],
    declarations: [
        RaidsComponent,
        InsertRaidComponent,
        TickModalComponent,
        RaidDetailsComponent,
        TickComponent,
        TickHelperComponent,
        CharSelectComponent
    ],
    entryComponents: [
        TickModalComponent,
    ],
})
export class RaidsModule {}