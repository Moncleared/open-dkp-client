import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DkpService } from '../../services/dkp.service';
import { CharacterModel } from '../../models/CharacterModel';
import { Config } from '../../models/Config';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { CognitoUtil } from '../../services/cognito.service';
import * as _ from "lodash";
import { UserRequest } from '../../models/UserRequest';

@Component({
    templateUrl: 'details.component.html',
})
export class DetailsCharacterComponent extends BaseComponent implements OnInit {
    constructor(
        private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router,
        private route: ActivatedRoute) {
        super(cognitoService, loadingService, router);
    }
    @ViewChild(ModalDirective) smallModal: ModalDirective;
    ranks = Config.Ranks;
    classes = Config.Classes;
    races = Config.Races;
    model = new CharacterModel('Loading...', this.ranks[0], this.classes[0], 0, 'Human', 'Male');
    disabled = false;
    vItems = [];
    vAdjustments = [];
    vRaids = [];

    ngOnInit(): void {
        this.disabled = true;
        this.loadingService.setLoadingStatus(true);
        //Get Character Data
        var charName = this.route.snapshot.paramMap.get("name");
        this.dkpService.getCharacter(charName).then(x => {
            this.disabled = false;
            this.model = x;
            this.loadingService.setLoadingStatus(false);
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.model = new CharacterModel('Loading...', this.ranks[0], this.classes[0], 0, 'Human', 'Male');
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });

        //Get Item Data
        this.dkpService.getItemsByCharacter(charName).then(results => {
            this.vItems = _.orderBy(results, x => { return x.Date; }, ['desc', 'asc']);
        }).catch(error => {
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });

        //Get Adjustment Data
        this.dkpService.getAdjustmentsByCharacter(charName).then(results => {
            this.vAdjustments = _.orderBy(results, x => { return x.Date; }, ['desc', 'asc']);
        }).catch(error => {
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });

        //Get Raid Data
        this.dkpService.getRaidsByCharacter(charName).then(results => {
            this.vRaids = _.orderBy(results, x => { return x.Timestamp; }, ['desc', 'asc']);
        }).catch(error => {
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });
    }

    claimCharacter(): void {
        this.loadingService.setLoadingStatus(true);
        this.disabled = true;

        var vRequest = new UserRequest();
        vRequest.RequestDetails = `{characterId:${this.model.IdCharacter}}`;
        vRequest.RequestType = UserRequest.TYPE_CHARACTER_ASSIGN;
        
        this.dkpService.putRequest(vRequest).then( result => {
            this.alerts.push({
                type: 'success',
                msg: `Request submitted successfully, please wait for administrator to review...`
            });            
            this.loadingService.setLoadingStatus(false);
            this.disabled = false;
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.disabled = false;            
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });   
    }

    deleteCharacter(): void {
        this.loadingService.setLoadingStatus(true);
        this.smallModal.hide();
        this.disabled = true;
        var charName = this.route.snapshot.paramMap.get("name");

        this.dkpService.deleteCharacter(charName).then(x => {
            this.router.navigate(['/characters']);
            this.loadingService.setLoadingStatus(false);
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });
    }

    navToCharEdit(): void {
        this.router.navigate([`/characters/update/${this.model.Name}`]);
    }
}