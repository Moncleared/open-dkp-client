import { Component, OnInit } from '@angular/core';
import { DkpService } from '../../services/dkp.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { CognitoUtil } from '../../services/cognito.service'
import * as _ from "lodash";
import { Router } from '@angular/router';
import { CharacterModel } from '../../models/CharacterModel';

@Component({
    templateUrl: 'guildroster.component.html'
})
export class GuildRosterComponent extends BaseComponent implements OnInit {
    constructor(private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
    }

    ngOnInit(): void {
        this.dkpService.getAllCharacters(true).then(results => {
            this.AllCharacters = results;
            console.log(results);
        })
    }

    syncRoster(): void {
        this.disabled = true;
        this.loadingService.setLoadingStatus(true);
        var vLines = this.dump.split(/[\r\n]+/);
        var vModels: CharacterModel[] = [];
        vLines.forEach(element => {
            var vTokens = element.split('\t');
            var vModel = new CharacterModel(vTokens[0], vTokens[3], vTokens[2], vTokens[1]);
            if ( vModel.Rank=='Made Man' && vTokens[4]=='A' ) vModel.Rank = "PALT";
            var vIndex = this.AllCharacters.findIndex( x => x.Name.toLowerCase()===vModel.Name.toLowerCase())
            if (  vIndex > -1 ) {
                if ( this.AllCharacters[vIndex].Class.trim().toLowerCase() != vModel.Class.trim().toLowerCase() || 
                     this.AllCharacters[vIndex].Rank.trim().toLowerCase() != vModel.Rank.trim().toLowerCase() ||
                     this.AllCharacters[vIndex].Level != vModel.Level ) {
                    vModels.push(vModel);
                }
            }
        });
        
        var vRequest: any = {};
        vRequest.Action = "RosterUpdate";
        vRequest.Data = vModels;
        this.dkpService.postRosterUpdate(vRequest).then( results => {
            this.disabled = false;
            this.loadingService.setLoadingStatus(false);
            this.dump = results;
            this.alerts.push({
                type: 'success',
                msg: `Roster has been updated successfully!`
            });            
        }).catch(error => {
            this.disabled = false;
            this.loadingService.setLoadingStatus(false);
            this.dump = error;           
            console.log(error);
        });
    }

    fileChanged(e): void {
        this.file = e.target.files[0];
        this.uploadDocument();
    }

    uploadDocument(): void {
        let vFileReader = new FileReader();
        vFileReader.onload = (e) => {
            this.dump = vFileReader.result;
        }
        vFileReader.readAsText(this.file);
    }    

    clearDump(): void {
        this.dump = '';
    }    

    /* Binding Variables */
    public dump: any;
    public file: any;
    public AllCharacters: CharacterModel[] = [];
    public disabled: boolean = false;
}