import { Component, OnInit } from '@angular/core';
import { CognitoUtil } from '../../services/cognito.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { DkpService } from '../../services/dkp.service';
import { UserRequest, RequestType, RequestStatus } from '../../models/UserRequest';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { CharacterModel } from '../../models/CharacterModel';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RequestModalComponent } from '../modals/requestmodal.component';

@Component({
    templateUrl: 'profile.component.html'
})
export class ProfileComponent extends BaseComponent implements OnInit {

    /**
     * Moncs -
     * Constructor for ProfileComponent 
     * @param cognitoService 
     * @param loadingService 
     */
    constructor(private modalService: BsModalService,
        cognitoService: CognitoUtil,
        loadingService: LoadingDataService,
        private dkpService: DkpService,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.setIsLoginRequired(true);
    }

    ngOnInit(): void {
        this.cognitoService.getCurrentUser().subscribe(cognito => {
            this.Nickname = cognito['nickname'];
            this.Email = cognito['email'];
            this.Username = this.currentUser["cognito:username"];
            if (this.Username && this.Username.length > 0) {
                this.dkpService.getRequests(this.Username).then(result => {
                    this.PendingRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.PENDING);
                    this.ApprovedRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.APPROVED);
                    this.DeniedRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.DENIED);
                }).catch(error => {
                    console.log(error);
                });
            }
            if (this.Username && this.Username.length > 0) {
                this.dkpService.getCharactersByAccount(this.Username)
                    .then(x => {
                        this.CharacterList = x;
                        this.loadingService.setLoadingStatus(false);
                    })
                    .catch(error => {
                        //TODO: Finish error handling
                        console.log(error);
                    });
            }
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
    
    navToChar(vModel: CharacterModel): void {
        this.router.navigate([`/characters/${vModel.Name}`]);
    }

    navToCharEdit(vModel: CharacterModel): void {
        this.router.navigate([`/characters/update/${vModel.Name}`]);
    }    

    //private variables for storage
    bsModalRef: BsModalRef;

    /**
     * public variables for binding
     */
    public CharacterList: CharacterModel[] = [];
    public Username: string = '';
    public Nickname: string = '';
    public Email: string = '';
    public PendingRequestList: UserRequest[];
    public DeniedRequestList: UserRequest[];
    public ApprovedRequestList: UserRequest[];
    public RequestType = RequestType;
    public RequestStatus = RequestStatus;
}