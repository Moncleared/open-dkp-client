import { Component, OnInit } from '@angular/core';
import { DkpService } from '../../services/dkp.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { CognitoUtil } from '../../services/cognito.service'
import * as _ from "lodash";
import { DKPInfoModel } from '../../models/DKPInfoModel';
import { SettingsModel } from '../../models/SettingsModel';
import { UserRequest, RequestType, RequestStatus } from '../../models/UserRequest';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RequestModalComponent } from '../modals/requestmodal.component';
import { SummaryCardModel } from '../../models/SummaryCardsModel';
import { BatchModel } from '../../models/BatchModel';

@Component({
    templateUrl: 'admin.component.html'
})
export class AdminComponent extends BaseComponent implements OnInit {
    constructor(private modalService: BsModalService,
        private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
    }
    public dkpModel: DKPInfoModel = new DKPInfoModel();
    public scModel: SummaryCardModel = new SummaryCardModel();
    public nbModel: BatchModel = new BatchModel();
    public isLoading: boolean = false;
    public PendingRequestList: UserRequest[];
    public DeniedRequestList: UserRequest[];
    public ApprovedRequestList: UserRequest[];
    public RequestType = RequestType;
    public RequestStatus = RequestStatus;
    public dkpValuesAlerts: any = [];
    public summaryAlerts: any = [];
    public batchAlerts: any = [];
    bsModalRef: BsModalRef;

    ngOnInit(): void {
        this.isLoading = true;
        this.dkpService.getSetting("dkp_info").then(result => {
            var settingsModel = JSON.parse(result);
            if (settingsModel.SettingValue)
                this.dkpModel = JSON.parse(settingsModel.SettingValue);
            else
                this.dkpModel = new DKPInfoModel();
                this.isLoading = false;
        }).catch(error => {
            this.dkpModel = new DKPInfoModel();
            this.isLoading = false;
            console.log(error);
        });
        this.dkpService.getSetting('summary_card').then(result => {
            var settingsModel = JSON.parse(result);
            if (settingsModel.SettingValue)
                this.scModel = JSON.parse(settingsModel.SettingValue);
            else
                this.scModel = new SummaryCardModel();
                this.isLoading = false;
        }).catch(error => {
            this.scModel = new SummaryCardModel();
            this.isLoading = false;
            console.log(error);
        });

        this.dkpService.getSetting('batch_settings').then(result => {
            var settingsModel = JSON.parse(result);
            if (settingsModel.SettingValue)
                this.nbModel = JSON.parse(settingsModel.SettingValue);
            else
                this.nbModel = new BatchModel();
            this.isLoading = false;
        }).catch(error => {
            this.scModel = new SummaryCardModel();
            this.isLoading = false;
            console.log(error);
        });

        this.fetchRequests();
    }

    resetCache() {
        this.isLoading = true;
        this.loadingService.setLoadingStatus(true);
        this.dkpService.resetCache().then(result => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
        }).catch(error => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
            console.log(error);
        });
    }

    fetchRequests() {
        this.isLoading = true;
        this.loadingService.setLoadingStatus(true);
        this.PendingRequestList = [];
        this.ApprovedRequestList = [];
        this.DeniedRequestList = [];    
        this.dkpService.getAllRequests().then(result => {
            this.loadingService.setLoadingStatus(false);
            this.PendingRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.PENDING);
            this.PendingRequestList = _.orderBy(this.PendingRequestList, x => { return x.RequestTimestamp; }, ['desc', 'asc']);
            
            this.ApprovedRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.APPROVED);
            this.ApprovedRequestList = _.orderBy(this.ApprovedRequestList, x => { return x.RequestTimestamp; }, ['desc', 'asc']);    

            this.DeniedRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.DENIED);
            this.DeniedRequestList = _.orderBy(this.DeniedRequestList, x => { return x.RequestTimestamp; }, ['desc', 'asc']); 
            this.isLoading = false;
        }).catch(error => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
            console.log(error);
        });        
    }

    updateBatchSettings() {
        if (!this.nbModel.Days || this.nbModel.Days <= 0 || isNaN(this.nbModel.Days)) {
            this.batchAlerts.push({
                type: 'danger',
                msg: `You need to specify a number greater than 0 for the Days`
            });
            return;
        }
        this.loadingService.setLoadingStatus(true);
        this.isLoading = true;
        var vSettingModel = new SettingsModel();
        vSettingModel.SettingName = "batch_settings";
        vSettingModel.SettingValue = JSON.stringify(this.nbModel);
        vSettingModel.UpdatedBy = this.currentUser["cognito:username"];
        vSettingModel.UpdatedTimestamp = new Date();

        this.dkpService.putSetting(vSettingModel).then(result => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
            this.batchAlerts.push({
                type: 'success',
                msg: `Saved successfully`
            });
        }).catch(error => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
            this.batchAlerts.push({
                type: 'danger',
                msg: `${error}`
            });
        });
    }

    updateDkpInfo() {
        if ( isNaN(this.dkpModel.BRV) || isNaN(this.dkpModel.DKPCap) || isNaN(this.dkpModel.MaxBidAlt) || 
             isNaN(this.dkpModel.MaxBidMain) || isNaN(this.dkpModel.MaxBidRA) || isNaN(this.dkpModel.MinBid) || 
             isNaN(this.dkpModel.MinBidInc)  ) {
                this.dkpValuesAlerts.push({
                    type: 'danger',
                    msg: `You need to specify numbers for these values`
                });
            return;
        }
        this.loadingService.setLoadingStatus(true);
        this.isLoading = true;
        var vSettingModel = new SettingsModel();
        vSettingModel.SettingName = "dkp_info";
        vSettingModel.SettingValue = JSON.stringify(this.dkpModel);
        vSettingModel.UpdatedBy = this.currentUser["cognito:username"];
        vSettingModel.UpdatedTimestamp = new Date();
        
        this.dkpService.putSetting(vSettingModel).then(result => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
            this.dkpValuesAlerts.push({
                type: 'success',
                msg: `Saved successfully`
            });
        }).catch(error => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
            this.dkpValuesAlerts.push({
                type: 'danger',
                msg: `${error}`
            });
        });
    }

    updateSummaryCard() {
        if ( !this.scModel.Ranks || this.scModel.Ranks.length < 0 || isNaN(this.scModel.ListSize) ) {
                this.dkpValuesAlerts.push({
                    type: 'danger',
                    msg: `You need to specify numbers for these values`
                });
            return;
        }
        this.loadingService.setLoadingStatus(true);
        this.isLoading = true;
        var vSettingModel = new SettingsModel();
        vSettingModel.SettingName = "summary_card";
        vSettingModel.SettingValue = JSON.stringify(this.scModel);
        vSettingModel.UpdatedBy = this.currentUser["cognito:username"];
        vSettingModel.UpdatedTimestamp = new Date();
        
        this.dkpService.putSetting(vSettingModel).then(result => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
            this.summaryAlerts.push({
                type: 'success',
                msg: `Saved successfully`
            });
        }).catch(error => {
            this.isLoading = false;
            this.loadingService.setLoadingStatus(false);
            this.summaryAlerts.push({
                type: 'danger',
                msg: `${error}`
            });
        });
    }

    /**
     * This will open the Modal for User to Edit Raid Tick
     * @param tick the raid tick which is to be editted within the modal
     */
    requestDetails(request) {
        const initialState = {
            inputModel: request
        };
        this.bsModalRef = this.modalService.show(RequestModalComponent, { initialState, class: 'modal-lg' });
    }    

    /**
     * Backend server handles most of this work, we just need to tell it what request to approve/deny
     * @param pRequest Simple request object to identify what request to update with what status
     */    
    approveRequest(pRequest: UserRequest) {
        this.alerts = [];
        this.isLoading = true;
        pRequest.RequestStatus = RequestStatus.APPROVED;
        this.loadingService.setLoadingStatus(true);
        this.dkpService.updateRequest(pRequest).then(result => {
            this.loadingService.setLoadingStatus(false);
            this.fetchRequests();
            this.alerts.push({
                type: 'success',
                msg: `Request APPROVED successfully!`
            });            
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.fetchRequests();
            this.alerts.push({
                type: 'danger',
                msg: `${error}`
            });
        });
    }

    /**
     * Backend server handles most of this work, we just need to tell it what request to approve/deny
     * @param pRequest Simple request object to identify what request to update with what status
     */
    denyRequest(pRequest) {
        this.alerts = [];
        this.isLoading = true;
        pRequest.RequestStatus = RequestStatus.DENIED;
        this.loadingService.setLoadingStatus(true);
        this.dkpService.updateRequest(pRequest).then(result => {
            this.loadingService.setLoadingStatus(false);
            this.fetchRequests();
            pRequest = result;
            this.alerts.push({
                type: 'success',
                msg: `Request DENIED successfully!`
            });               
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.fetchRequests();
            this.alerts.push({
                type: 'danger',
                msg: `${error}`
            });
        });
    }
}