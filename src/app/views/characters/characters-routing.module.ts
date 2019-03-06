import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertCharacterComponent } from './insert.component';
import { UpdateCharacterComponent } from './update.component';
import { DetailsCharacterComponent } from './details.component';
import { CharactersComponent } from './characters.component';

const routes: Routes = [{
    path: '',
    data: {
        title: 'Characters'
    },
    children: [{
            path: '',
            component: CharactersComponent,
            data: {
                title: 'Characters'
            }
        },
        {
            path: 'insert',
            component: InsertCharacterComponent,
            data: {
                title: 'Insert Character'
            }
        },
        {
            path: 'update/:name',
            component: UpdateCharacterComponent,
            data: {
                title: 'Update Character'
            }
        },
        {
            path: ':name',
            component: DetailsCharacterComponent,
            data: {
                title: 'Character Details'
            }
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CharactersRoutingModule {}