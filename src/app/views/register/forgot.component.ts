import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil } from '../../services/cognito.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: 'forgot.component.html'
})
/**
 * I don't like this, nor the verify component. I eventually just want to make a modal that handles this and you pass in a component
 */
export class ForgotComponent extends BaseComponent {

    constructor(cognitoService: CognitoUtil,
        loadingService: LoadingDataService,
        router: Router) {
        super(cognitoService, loadingService, router);
    }

    resetSubmit() {
        this.username = this.username.trim();
        this.alerts = [];
        if (this.username.length > 0 && this.code.length > 0) {
            this.loadingService.setLoadingStatus(true);
            this.cognitoService.forgotPasswordSubmit(this.username, this.code, this.newPassword).then(result => {
                this.loadingService.setLoadingStatus(false);
                this.pushAlert("Your password has been reset!", 'success');
            }).catch(error => {
                this.loadingService.setLoadingStatus(false);
                console.log(error);
                this.pushAlert(error.message, 'danger');
            });          
        } else if ( this.username.length > 0 ) {
            this.loadingService.setLoadingStatus(true);
            this.cognitoService.forgotPassword(this.username).then(result => {
                this.loadingService.setLoadingStatus(false);
                this.STATE = !this.STATE;
                this.pushAlert("Check your email for the verification code", 'success');
            }).catch(error => {
                this.loadingService.setLoadingStatus(false);
                console.log(error);
                this.pushAlert(error.message, 'danger');
            });
        }
    }

    verifyCode(state) {
        if (!state) {
            this.code = "";
            this.newPassword = "";
        }
        this.STATE = !state;
    }

    public username: string = "";
    public code: string = "";
    public newPassword: string ="";
    public STATE: boolean = true;
}