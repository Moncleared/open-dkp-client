import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryComponent } from './summary.component';

const routes: Routes = [
    {
        path: '',
        component: SummaryComponent,
        data: {
            title: 'Summary'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DkpRoutingModule {}