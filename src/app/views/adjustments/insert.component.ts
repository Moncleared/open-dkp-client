import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { DkpService } from '../../services/dkp.service';
import { AdjustmentModel } from '../../models/AdjustmentModel';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { CognitoUtil } from '../../services/cognito.service';
import { Router } from '@angular/router';

export function getAlertConfig(): AlertConfig {
    return Object.assign(new AlertConfig(), { type: 'success' });
}

@Component({
    templateUrl: 'insert.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: AlertConfig, useFactory: getAlertConfig }]
})
export class InsertAdjustmentComponent extends BaseComponent implements OnInit {
    constructor(private dkpService: DkpService,
        cognitoService: CognitoUtil,
        loadingService: LoadingDataService,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
    }
    bsValue = new Date();
    date = new Date().toLocaleDateString();
    defaultModel = new AdjustmentModel(null, 'Reason for Adjustment', 'Additional Details if needed', 250);
    model = this.defaultModel;
    disabled = false;

    onSubmit(): void {
        this.loadingService.setLoadingStatus(true);
        this.disabled = true;
        this.alerts = [];
        this.ValidateModel();
        this.dkpService.insertAdjustment(this.model).then(adjustment => {
            this.disabled = false;
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'success',
                msg: `${this.model.Name} has been added successfully!`
            });
        }).catch(error => {
            this.disabled = false;
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });
    }

    ValidateModel() {
        this.model.Character = this.model.Character.trim();
        if (!this.date || !Date.parse(this.date)) {
            this.model.Timestamp = new Date().toLocaleDateString();
        } else {
            this.model.Timestamp = this.date;
        }
    }

    ngOnInit(): void {
        this.model = this.defaultModel;
    }

    newAdjustment(): void {
        this.alerts = [];
        this.model = this.defaultModel;
    }
}