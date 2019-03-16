import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil } from '../../services/cognito.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'register-dashboard',
    templateUrl: 'register.component.html'
})
export class RegisterComponent extends BaseComponent {

    constructor(cognitoService: CognitoUtil,
        loadingService: LoadingDataService,
        router: Router) {
        super(cognitoService, loadingService, router);
    }

    public username: string = '';
    public password: string = '';
    public email: string = '';
    public nickname: string = '';

    public register() {
        this.alerts = [];
        this.username = this.username.trim();
        this.email = this.email.trim();
        this.nickname = this.nickname.trim();

        //Validation Checks
        if (this.username.length <= 0 || this.email.length <= 0 || this.nickname.length <= 0) {
            this.pushAlert('Invalid username/email/nickname, must not be blank!', 'danger');
            return;
        }

        this.cognitoService.signUp(this.username, this.password, this.email, this.nickname)
            .then(x => {
                this.cognitoService.setLastUserName(this.username);
                this.router.navigate(['/verify']);
            })
            .catch(err => {
                this.pushAlert(err.message, 'danger');
            })
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
    
    pushAlert(message, type) {
        this.alerts.push({
            type: type,
            msg: message
        });
    }
}