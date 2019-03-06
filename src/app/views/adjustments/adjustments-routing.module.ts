import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AdjustmentsComponent } from './adjustments.component';
import { InsertAdjustmentComponent } from './insert.component';
import { UpdateAdjustmentComponent } from './update.component';


const routes: Routes = [{
        path: '',
        component: AdjustmentsComponent,
        data: {
            title: 'Adjustments'
        }
    },
    {
        path: 'insert',
        component: InsertAdjustmentComponent,
        data: {
            title: 'Insert Adjustment'
        }
    },
    {
        path: 'update/:id',
        component: UpdateAdjustmentComponent,
        data: {
            title: 'Update Adjustment'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), BsDatepickerModule.forRoot()],
    exports: [RouterModule]
})
export class AdjustmentsRoutingModule {}