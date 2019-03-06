import { Injectable, Injector } from '@angular/core';
import { Resolve } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ClientModel } from '../models/ClientModel';
import { CognitoUtil } from '../services/cognito.service';

@Injectable()
export class ClientResolve implements Resolve < any > {

    constructor(private clientService: ClientService,
                private injector: Injector) {}

    /**
     * This resolve is designed to ensure that we get the client info first and then attempt to login before loading any pages
     */
    resolve() {
        var subDomain = window.location.hostname.split('.')[0];

        return new Promise((resolve, reject) => {
            if (subDomain && subDomain.length > 0) {
                subDomain = subDomain.trim().toLowerCase();
                this.clientService.getClient(subDomain)
                .subscribe(
                    (data: ClientModel) => {
                        this.clientService.clientDetails = data;
                        var vUtil = this.injector.get(CognitoUtil);
                        vUtil.init().then( ()=> {
                            resolve(data);
                        }).catch( () => {
                            resolve(data);
                        });
                    }, // success path
                    error => {resolve(error) } // error path
                );                
            } else {
                resolve('bad subdomain');
            }
        });
    }
}