import { Component } from '@angular/core';
import { CognitoUtil } from '../../services/cognito.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
    templateUrl: 'base.component.html'
})

export class BaseComponent {
    public isAdmin: boolean = false;
    public alerts: any = [];
    public isAuthenticated: boolean = false;
    public currentUser: any;
    private isProtectedPage = false;
    private isLoginRequired = false;

    constructor(protected cognitoService: CognitoUtil,
                protected loadingService: LoadingDataService,
                protected router: Router) {
        cognitoService.isDkpAdmin().subscribe(x => {
            this.isAdmin = x;
            this.authChangeDetected();
        });
        this.cognitoService.isAuthenticated().subscribe(x => { 
            this.isAuthenticated = x; 
            this.authChangeDetected();
        });
        this.cognitoService.getCurrentUser().subscribe(x => { 
            this.currentUser = x;
            this.authChangeDetected();
        });
        this.router.events.subscribe(event => {
            if(event instanceof NavigationStart) {
                this.loadingService.setLoadingStatus(false);
            }
        });
    }

    setIsLoginRequired(isLoginRequired: boolean) {
        this.isLoginRequired = isLoginRequired;
        this.authChangeDetected();
    }

    setProtectedPage(isProtected: boolean) {
        this.isProtectedPage = isProtected;
        this.authChangeDetected();
    }

    authChangeDetected() {
        //You must be logged in and Admin to view protected pages
        //To anyone reading this, backend server still validates requests coming in
        if ( this.isProtectedPage && (!this.isAdmin || !this.isAuthenticated) ) {
            this.router.navigate(['/login']);
        }
        
        //If the page requires login and you aren't authenticated, get authenticated
        if ( this.isLoginRequired && !this.isAuthenticated ) {
            this.router.navigate(['/login']);
        }        
    }

    pushAlert(message, type) {
        this.alerts.push({
            type: type,
            msg: message
        });
    }
}