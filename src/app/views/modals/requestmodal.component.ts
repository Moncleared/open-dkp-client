import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as _ from "lodash";
import { UserRequest, RequestType, RequestStatus } from '../../models/UserRequest';
import { CharacterModel } from '../../models/CharacterModel';

@Component({
    templateUrl: 'requestmodal.component.html'
})
export class RequestModalComponent implements OnInit {
    @Input() inputModel: UserRequest;
    public RequestType = RequestType;
    public RequestStatus = RequestStatus;
    public RequestDetails: any = {};
    public CharacterModel: CharacterModel;
    public RaidTickModel: any;

    constructor(public bsModalRef: BsModalRef) {
    }
    
    ngOnInit() {
        this.RequestDetails = JSON.parse(this.inputModel.RequestDetails);
        if ( this.inputModel.RequestType == RequestType["Character Assign"]) {
            this.CharacterModel = JSON.parse(this.RequestDetails.character);
            //If undefined or null likely means the character no longer exists in DB
            if (!this.CharacterModel) this.CharacterModel = new CharacterModel("UNKNOWN", "UNKNOWN", "UNKONWN", 1);
        }
        if ( this.inputModel.RequestType == RequestType["Raid Tick"]) {
            this.RaidTickModel = JSON.parse(this.RequestDetails.raid);
        }
    }
}