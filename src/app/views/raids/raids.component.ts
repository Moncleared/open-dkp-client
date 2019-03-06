import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DkpService } from '../../services/dkp.service';
import { RaidModel } from '../../models/RaidModel';
import { Router } from '@angular/router';
import { LoadingDataService } from '../utilities/loading-data.service';
import { CognitoUtil } from '../../services/cognito.service';
import { BaseComponent } from '../base/base.component';
import * as _ from "lodash";

@Component({
    templateUrl: 'raids.component.html'
})
export class RaidsComponent extends BaseComponent implements OnInit {

    constructor(private dkpService: DkpService,
        router: Router,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil) {

        super(cognitoService, loadingService, router);
    }

    @ViewChild(ModalDirective) smallModal: ModalDirective;
    fRaids: RaidModel[];

    ngOnInit(): void {
        this.loadingService.setLoadingStatus(true);
        this.dkpService.getAllRaids().then(raids => {
            this.fRaids = _.orderBy(raids, x => { return x.Timestamp; }, ['desc', 'asc']);
            this.loadingService.setLoadingStatus(false);
        }).catch(error => {
            //TODO: finish this error handling
            console.log('error');
        })
    }

    navToRaidEdit(pModel: any) {
        this.router.navigate([`/raids/insert/${pModel.IdRaid}`]);
    }

    navToRaid(pModel: any) {
        this.router.navigate([`/raids/${pModel.IdRaid}`]);
    }
}