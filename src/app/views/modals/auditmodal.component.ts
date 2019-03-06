import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from "lodash";
import { AuditModel } from '../../models/AuditModel';
import { DkpService } from '../../services/dkp.service';
import { LoadingDataService } from '../utilities/loading-data.service';

@Component({
    templateUrl: 'auditmodal.component.html'
})
export class AuditModalComponent implements OnInit {
    @Input() inputModel: AuditModel;

    constructor(private dkpService: DkpService,
                private loadingService: LoadingDataService,
                public bsModalRef: BsModalRef) {
    }
    
    ngOnInit() {
        this.loadingService.setLoadingStatus(true);
        this.dkpService.getAuditById(this.inputModel.Id).then( result => {
            this.inputModel = result[0];
            this.inputModel.NewValue = JSON.parse(this.inputModel.NewValue);
            this.inputModel.OldValue = JSON.parse(this.inputModel.OldValue);
            this.loadingService.setLoadingStatus(false);
        }).catch(error => {
            console.log(error);
            this.loadingService.setLoadingStatus(false);
        });
    }
}