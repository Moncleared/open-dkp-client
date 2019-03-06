import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { RaidsComponent } from './raids.component';
import { InsertRaidComponent } from './insert.component';
import { RaidDetailsComponent } from './details.component';
import { TickHelperComponent } from './tickhelper.component';
import { CharSelectComponent } from './charselect.component';

const routes: Routes = [{
        path: '',
        component: RaidsComponent,
        data: {
            title: 'Raids'
        }
    },
    {
        path: 'insert',
        component: InsertRaidComponent,
        data: {
            title: 'Insert Raid'
        }
    },
    {
        path: 'charselect',
        component: CharSelectComponent,
        data: {
            title: 'Character Select'
        }
    },
    {
        path: 'insert/:id',
        component: InsertRaidComponent,
        data: {
            title: 'Update Raid'
        }
    },
    {
        path: ':id',
        component: RaidDetailsComponent,
        data: {
            title: 'Raid Details'
        }
    },
    {
        path: 'ticks/:name',
        component: TickHelperComponent,
        data: {
            title: 'Character Raid Ticks'
        }
    }    
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot()
    ],
    exports: [RouterModule, TimepickerModule]
})
export class RaidsRoutingModule {}