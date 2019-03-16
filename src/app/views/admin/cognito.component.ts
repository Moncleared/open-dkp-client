import { Component, OnInit } from '@angular/core';
import { DkpService } from '../../services/dkp.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { CognitoUtil } from '../../services/cognito.service'
import * as _ from "lodash";
import { Router } from '@angular/router';

@Component({
    templateUrl: 'cognito.component.html'
})
export class CognitoComponent extends BaseComponent implements OnInit {
    constructor(private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
    }

    ngOnInit(): void {
        this.loadingService.setLoadingStatus(true);
        this.dkpService.getAllCognitoUsers().then(result => {
            this.loadingService.setLoadingStatus(false);
            var vTmpAdmins = [];
            var vTmpUsers = [];
            result.Admins.forEach(element => {
                let vUser: any = {};
                vUser.Username = element.Username;
                vUser.Nickname = this.getAttribute('nickname', element);
                vUser.Email = this.getAttribute('email', element);
                vTmpAdmins.push(vUser);
            });
            result.AllUsers.forEach(element => {
                let vUser: any = {};
                vUser.Username = element.Username;
                vUser.Nickname = this.getAttribute('nickname', element);
                vUser.Email = this.getAttribute('email', element);
                vTmpUsers.push(vUser);
            });            
            this.Admins = _.cloneDeep(vTmpAdmins);
            this.Users = _.cloneDeep(vTmpUsers);
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.pushAlert(`${error.response.data.ErrorMessage}`, 'danger');
            console.log(error);
        })
    }

    removeAdmin(pData) {
        this.loadingService.setLoadingStatus(true);
        this.dkpService.removeDkpAdmin(pData.Username).then(result => {
            this.ngOnInit();
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.pushAlert(`${error.response.data.ErrorMessage}`, 'danger');
            console.log(error);
        });
    }

    addAdmin(pData) {
        this.loadingService.setLoadingStatus(true);
        this.dkpService.addDkpAdmin(pData.Username).then(result => {
            this.ngOnInit();
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.pushAlert(`${error.response.data.ErrorMessage}`, 'danger');
            console.log(error);
        });
    }

    getAttribute(pAttributeName, pElement) {
        var index = _.findIndex(pElement.Attributes, (element: any) => {
            return element.Name == pAttributeName
        });
        return pElement.Attributes[index].Value;
    }

    /* Binding Variables */
    public disabled: boolean = false;
    public Admins: any = [];
    public Users: any = [];
}