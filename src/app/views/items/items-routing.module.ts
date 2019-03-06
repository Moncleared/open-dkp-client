import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsComponent } from './items.component';

const routes: Routes = [{
    path: '',
    data: {
        title: 'Items'
    },
    children: [{
            path: '',
            component: ItemsComponent,
            data: {
                title: 'Items'
            }
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CharactersRoutingModule {}