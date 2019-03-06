import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AdminComponent } from './admin.component';
import { GuildRosterComponent } from './guildroster.component';
import { CognitoComponent } from './cognito.component';
import { AuditComponent } from './audit.component';


const routes: Routes = [{
    path: '',
    data: {
        title: 'Admin'
    },
    children: [{
            path: '',
            component: AdminComponent,
            data: {
                title: 'Admin'
            }
        },
        {
            path: 'roster',
            component: GuildRosterComponent,
            data: {
                title: 'Roster Tool'
            }
        },
        {
            path: 'usergroups',
            component: CognitoComponent,
            data: {
                title: 'Add/Remove Admin users'
            }
        },
        {
            path: 'audit',
            component: AuditComponent,
            data: {
                title: 'Audit'
            }
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes), BsDatepickerModule.forRoot()],
    exports: [RouterModule]
})
export class AdminRoutingModule {}