import { Component, AfterViewInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil } from '../../services/cognito.service'
import { LoadingDataService } from '../utilities/loading-data.service';

@Component({
    selector: 'login-dashboard',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements AfterViewInit {
    @ViewChildren('input') vc;
    username: string;
    password: string;
    errorMessage: string;

    /**
     * Moncs -
     * Constructor will setup observables, basically need to listen for an error
     * message or a successful login in which case we'll navigate somewhere
     * TODO: probably should navigate to the page prior to Login?
     * @param router 
     * @param cognito 
     */
    constructor(private router: Router,
        private loadingService: LoadingDataService, 
        private cognito: CognitoUtil) {
        this.cognito.getErrorMessage().subscribe(x => { 
            this.loadingService.setLoadingStatus(false);
            this.errorMessage = x.message 
        });
        this.cognito.isAuthenticated().subscribe(auth => {
            this.loadingService.setLoadingStatus(false);
            if (auth) this.router.navigate(['/dkp']);
        });
    }

    /**
     * Moncs -
     * Not sure if there is a better way to handle this BUT
     * Need to set focus, autofocus on the html attribute
     */
    ngAfterViewInit() {
        this.vc.first.nativeElement.focus();
    }

    /**
     * Moncs -
     * Simply login!
     */
    authenticate() {
        this.loadingService.setLoadingStatus(true);
        this.cognito.login(this.username, this.password);
    }
}