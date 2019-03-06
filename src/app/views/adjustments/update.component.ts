import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { DkpService } from '../../services/dkp.service';
import { AdjustmentModel } from '../../models/AdjustmentModel';
import { LoadingDataService } from '../utilities/loading-data.service';
import { CognitoUtil } from '../../services/cognito.service';
import { BaseComponent } from '../base/base.component';

export function getAlertConfig(): AlertConfig {
    return Object.assign(new AlertConfig(), { type: 'success' });
}

@Component({
    templateUrl: 'update.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: AlertConfig, useFactory: getAlertConfig }]
})
export class UpdateAdjustmentComponent extends BaseComponent implements OnInit {
    constructor(private dkpService: DkpService,
        private route: ActivatedRoute,
        router: Router,
        cognitoService: CognitoUtil,
        loadingService: LoadingDataService) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
    }
    model:any = new AdjustmentModel("Loading", 'Loading', 'Loading', 0);
    originalModel;
    disabled = false;

    onSubmit(): void {
        this.loadingService.setLoadingStatus(true);
        this.disabled = true;
        this.alerts = [];
        this.ValidateModel();

        this.dkpService.updateAdjustment(this.model).then(adjustment => {
            this.disabled = false;
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'success',
                msg: `Adjustment has been updated successfully!`
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
        if (!this.model.Timestamp || !Date.parse(this.model.Timestamp)) {
            this.model.Timestamp = new Date().toLocaleDateString();
        }
    }

    ngOnInit(): void {
        this.loadingService.setLoadingStatus(true);
        var adjustId = this.route.snapshot.paramMap.get("id");
        this.dkpService.getAdjustmentById(adjustId).then(adjustment => {
            this.loadingService.setLoadingStatus(false);
            this.model = adjustment;
            this.model.Timestamp = new Date(this.model.Timestamp).toLocaleDateString();
            this.originalModel = JSON.parse(JSON.stringify(adjustment));
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        })
    }

    newAdjustment(): void {
        this.alerts = [];
        this.model = JSON.parse(JSON.stringify(this.originalModel));
    }
}