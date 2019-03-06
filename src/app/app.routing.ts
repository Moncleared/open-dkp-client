import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { RootLayoutComponent } from './containers/default-layout/root-layout.component';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { VerifyComponent } from './views/register/verify.component';
import { ForgotComponent } from './views/register/forgot.component';
import { ProfileComponent } from './views/profile/profilt.component';
import { ChatComponent } from './views/chat/chat.component';
import { ClientResolve } from './resolves/client.resolve';
import { ClientSelectComponent } from './views/register/clientselect.component';

export const routes: Routes = [{
        path: '',
        redirectTo: 'dkp',
        pathMatch: 'full',
    },
    {
        path: '404',
        component: P404Component,
        data: {
            title: 'Page 404'
        }
    },
    {
        path: '500',
        component: P500Component,
        data: {
            title: 'Page 500'
        }
    },
    {
        path: 'clients',
        component: ClientSelectComponent,
        data: {
            title: 'Select Client'
        }
    },
    {
        path: '',
        component: RootLayoutComponent,
        resolve: {
            client: ClientResolve
        },
        data: {
            title: 'Home'
        },
        children: [{
                path: 'dkp',
                loadChildren: './views/dkp/dkp.module#DkpModule'
            },
            {
                path: 'raids',
                loadChildren: './views/raids/raids.module#RaidsModule'
            },
            {
                path: 'characters',
                loadChildren: './views/characters/characters.module#CharactersModule'
            },
            {
                path: 'items',
                loadChildren: './views/items/items.module#ItemsModule'
            },
            {
                path: 'adjustments',
                loadChildren: './views/adjustments/adjustments.module#AdjustmentsModule'
            },
            {
                path: 'dashboard',
                loadChildren: './views/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'admin',
                loadChildren: './views/admin/admin.module#AdminModule'
            },
            {
                path: 'login',
                component: LoginComponent,
                data: {
                    title: 'Login Page'
                }
            },
            {
                path: 'chat',
                component: ChatComponent,
                data: {
                    title: 'Chat'
                }
            },
            {
                path: 'register',
                component: RegisterComponent,
                data: {
                    title: 'Register Page'
                }
            },
            {
                path: 'verify',
                component: VerifyComponent,
                data: {
                    title: 'Verify Email'
                }
            },
            {
                path: 'forgot',
                component: ForgotComponent,
                data: {
                    title: 'Forgot Password'
                }
            },
            {
                path: 'profile',
                component: ProfileComponent,
                data: {
                    title: 'Profile'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}