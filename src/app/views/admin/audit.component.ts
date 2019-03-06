import { Component, OnInit } from '@angular/core';
import { DkpService } from '../../services/dkp.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { CognitoUtil } from '../../services/cognito.service'
import * as _ from "lodash";
import { Router } from '@angular/router';
import { AuditModel } from '../../models/AuditModel';
import { AuditModalComponent } from '../modals/auditmodal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'audit.component.html'
})
export class AuditComponent extends BaseComponent implements OnInit {
    constructor(private modalService: BsModalService,
        private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
    }

    ngOnInit(): void {
        this.loadingService.setLoadingStatus(true);
        this.dkpService.getAllAudits().then(result => {
            this.Audits = _.orderBy(result, x => { return x.Timestamp; }, ['desc', 'asc']);
            this.loadingService.setLoadingStatus(false);
        }).catch(error => {
            //TODO: Handle error better
            console.log(error);
            this.loadingService.setLoadingStatus(false);
        });          
    }

    /**
     * This will open the Modal to review Audit details
     * @param tick the audit modal to be displayed to user
     */
    auditDetails(audit) {
        const initialState = {
            inputModel: audit
        };
        this.bsModalRef = this.modalService.show(AuditModalComponent, { initialState, class: 'modal-lg' });
    } 

    /* Binding Variables */
    public Audits: AuditModel[] = [];
    bsModalRef: BsModalRef;
}