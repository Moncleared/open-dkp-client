import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, } from '@angular/router';
import { DkpService } from '../../services/dkp.service';
import { AdjustmentModel } from '../../models/AdjustmentModel';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoadingDataService } from '../utilities/loading-data.service';
import { CognitoUtil } from '../../services/cognito.service';
import { BaseComponent } from '../base/base.component';
import * as _ from "lodash";

@Component({
    templateUrl: 'adjustments.component.html'
})
export class AdjustmentsComponent extends BaseComponent implements OnInit {
    constructor(private dkpService: DkpService,
        router: Router,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil) {
        super(cognitoService, loadingService, router);
    }

    @ViewChild(ModalDirective) smallModal: ModalDirective;

    public AdjustmentList: AdjustmentModel[] = [];
    private OriginalData: AdjustmentModel[] = [];
    public filterBy: string;

    public vTemp: AdjustmentModel[];
    deleteId = -1;

    ngOnInit(): void {
        this.loadingService.setLoadingStatus(true);
        this.dkpService.getAllAdjustments().then(adjustments => {
            this.OriginalData = _.cloneDeep(adjustments);
            this.AdjustmentList = _.orderBy(adjustments, x => { return x.Timestamp; }, ['desc', 'asc']);
            this.loadingService.setLoadingStatus(false);
        }).catch(error => {
            this.pushAlert(error, 'danger');
            console.log(error);
            this.loadingService.setLoadingStatus(false);
        });
    }

    onKey(event) {
        console.log(event);
        if (this.filterBy && this.filterBy.length > 0) {
            this.AdjustmentList = _.filter(this.OriginalData, model => {
                return (model.Name && model.Name.length > 0 && model.Name.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1) ||
                    (model.Character && model.Character.length > 0 && model.Character.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
            });
        }
    }    

    navToChar(vModel: AdjustmentModel): void {
        this.router.navigate([`/characters/${vModel.Character}`]);
    }

    navToEdit(vModel: AdjustmentModel): void {
        this.router.navigate([`/adjustments/update/${vModel.Id}`]);
    }

    getModelIdAndShow(vModel: AdjustmentModel) {
        this.deleteId = vModel.Id;
        this.smallModal.show();
    }

    deleteAdjustment(): void {
        this.smallModal.hide();
        this.loadingService.setLoadingStatus(true);
        this.dkpService.deleteAdjustment(this.deleteId).then(x => {
            this.pushAlert('Successfully deleted adjustment!', 'success');
            this.ngOnInit();
        }).catch(error => {
            this.pushAlert(error, 'danger');
            console.log(error);
            this.loadingService.setLoadingStatus(false);
        });
    }
}