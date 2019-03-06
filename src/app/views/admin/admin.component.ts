import { Component, OnInit, ViewChild } from '@angular/core';
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
    public isLoading: boolean = true;
    public PendingRequestList: UserRequest[];
    public DeniedRequestList: UserRequest[];
    public ApprovedRequestList: UserRequest[];
    public RequestType = RequestType;
    public RequestStatus = RequestStatus;
    bsModalRef: BsModalRef;

    ngOnInit(): void {
        this.dkpService.getSetting("dkp_info").then(result => {
            this.isLoading = false;
            var settingsModel = JSON.parse(result);
            this.dkpModel = JSON.parse(settingsModel.SettingValue);
        });
        this.fetchRequests();
    }

    fetchRequests() {
        this.PendingRequestList = [];
        this.ApprovedRequestList = [];
        this.DeniedRequestList = [];    
        this.dkpService.getAllRequests().then(result => {
            this.PendingRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.PENDING);
            this.PendingRequestList = _.orderBy(this.PendingRequestList, x => { return x.RequestTimestamp; }, ['desc', 'asc']);
            
            this.ApprovedRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.APPROVED);
            this.ApprovedRequestList = _.orderBy(this.ApprovedRequestList, x => { return x.RequestTimestamp; }, ['desc', 'asc']);    

            this.DeniedRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.DENIED);
            this.DeniedRequestList = _.orderBy(this.DeniedRequestList, x => { return x.RequestTimestamp; }, ['desc', 'asc']); 
        }).catch(error => {
            //TODO: Handle error better
            console.log(error);
        });        
    }

    updateDkpInfo() {
        var vSettingModel = new SettingsModel();
        vSettingModel.SettingName = "dkp_info";
        vSettingModel.SettingValue = JSON.stringify(this.dkpModel);
        vSettingModel.UpdatedBy = this.currentUser["cognito:username"];
        vSettingModel.UpdatedTimestamp = new Date();
        this.dkpService.putSetting(vSettingModel).then(result => {
            this.alerts.push({
                type: 'success',
                msg: `Saved successfully`
            });
        }).catch(error => {
            this.alerts.push({
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
        pRequest.RequestStatus = RequestStatus.APPROVED;
        this.dkpService.updateRequest(pRequest).then(result => {
            this.fetchRequests();
            this.alerts.push({
                type: 'success',
                msg: `Request APPROVED successfully!`
            });            
        }).catch(error => {
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
        pRequest.RequestStatus = RequestStatus.DENIED;
        this.dkpService.updateRequest(pRequest).then(result => {
            this.fetchRequests();
            pRequest = result;
            this.alerts.push({
                type: 'success',
                msg: `Request DENIED successfully!`
            });               
        }).catch(error => {
            this.fetchRequests();
            this.alerts.push({
                type: 'danger',
                msg: `${error}`
            });
        });
    }
}