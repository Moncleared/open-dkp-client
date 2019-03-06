// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ItemsComponent } from './items.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// Theme Routing
import { CharactersRoutingModule } from './items-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        NgxDatatableModule,
        CharactersRoutingModule
    ],
    declarations: [
        ItemsComponent,
    ]
})
export class ItemsModule {}