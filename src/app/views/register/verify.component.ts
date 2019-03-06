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

    public username: string;
    public code: string;


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
}