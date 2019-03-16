import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil } from '../../services/cognito.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: 'verify.component.html'
})
export class VerifyComponent extends BaseComponent {

    constructor(cognitoService: CognitoUtil,
        loadingService: LoadingDataService,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.cognitoService.lastUserName().subscribe(x => {
            this.username = x;
        });
    }

    public username: string = '';
    public code: string = '';


    public register() {
        this.alerts = [];
        this.username = this.username.trim();
        this.code = this.code.trim();

        //Validation checks
        if (this.username.length <= 0) {
            this.pushAlert("Invalid user name", 'danger');
            return;
        }
        if (this.code.length <= 0) {
            this.pushAlert("Invalid code", 'danger');
            return;
        }

        this.cognitoService.confirmSignUp(this.username, this.code)
            .then(x => {
                this.router.navigate(['/login']);
            })
            .catch(err => {
                this.pushAlert(err.message, 'danger');
            });
    }

    public resendCode() {
        if (this.username.length <= 0 ) {
            this.pushAlert('To resend verification code, enter your Username', 'danger');
            return;
        }

        this.cognitoService.resendCode(this.username).then(result => {
            this.pushAlert('Resent Verification code!', 'sucecss');
        }).catch(error => {
            this.pushAlert(error, 'danger');
        });     
    }

}