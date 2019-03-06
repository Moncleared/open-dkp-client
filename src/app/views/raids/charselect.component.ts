import { Component, OnInit } from '@angular/core';
import { CognitoUtil } from '../../services/cognito.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { CharacterModel } from '../../models/CharacterModel';
import { DkpService } from '../../services/dkp.service';

@Component({
    templateUrl: 'charselect.component.html'
})
export class CharSelectComponent extends BaseComponent implements OnInit {

    /**
     * Moncs -
     * Constructor for ProfileComponent 
     * @param cognitoService 
     * @param loadingService 
     */
    constructor(cognitoService: CognitoUtil,
        loadingService: LoadingDataService,
        private dkpService: DkpService,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.setIsLoginRequired(true);
    }

    ngOnInit(): void {
        this.cognitoService.getCurrentUser().subscribe(cognito => {
            this.Username = this.currentUser["cognito:username"];
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
     * public variables for binding
     */
    public CharacterList: CharacterModel[] = [];    
    public Username: string = '';
}