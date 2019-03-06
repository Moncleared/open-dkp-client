// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { InsertCharacterComponent } from './insert.component';
import { UpdateCharacterComponent } from './update.component';
import { DetailsCharacterComponent } from './details.component';
import { CharactersComponent } from './characters.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// Theme Routing
import { CharactersRoutingModule } from './characters-routing.module';

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
        InsertCharacterComponent,
        UpdateCharacterComponent,
        CharactersComponent,
        DetailsCharacterComponent
    ]
})
export class CharactersModule {}