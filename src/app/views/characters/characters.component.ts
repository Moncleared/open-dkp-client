import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DkpService } from '../../services/dkp.service';
import { CharacterModel } from '../../models/CharacterModel';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { CognitoUtil } from '../../services/cognito.service'
import * as _ from "lodash";

@Component({
    templateUrl: 'characters.component.html'
})
export class CharactersComponent extends BaseComponent implements OnInit {
    constructor(private dkpService: DkpService,
        router: Router,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil) {
        super(cognitoService, loadingService, router);
    }
    public vCharacterList: CharacterModel[] = [];
    private fOriginalData: CharacterModel[] = [];
    public filterBy: string;
    public isChecked: boolean = false;

    ngOnInit(): void {
        this.loadingService.setLoadingStatus(true);

        this.dkpService.getAllCharacters()
            .then(x => {
                this.vCharacterList = x;
                this.fOriginalData = _.cloneDeep(x);
                this.loadingService.setLoadingStatus(false);
            })
            .catch(error => {
                //TODO: Finish error handling
                console.log(error);
            });
    }

    onKey(event) {
        if (this.filterBy && this.filterBy.length > 0) {
            this.vCharacterList = _.filter(this.fOriginalData, model => {
                return (model.Name && model.Name.length > 0 && model.Name.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1) ||
                    (model.Class && model.Class.length > 0 && model.Class.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1) ||
                    (model.Rank && model.Rank.length > 0 && model.Rank.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1) ||
                    (model.Race && model.Race.length > 0 && model.Race.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1) ||
                    (model.Gender && model.Gender.length > 0 && model.Gender.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
            });
        } else {
            this.vCharacterList = _.cloneDeep(this.fOriginalData);
        }
    }

    isActiveToggle() {
        this.vCharacterList = [];
        this.loadingService.setLoadingStatus(true);
        this.dkpService.getAllCharacters(this.isChecked)
            .then(x => {
                this.vCharacterList = x;
                this.fOriginalData = _.cloneDeep(x);
                this.loadingService.setLoadingStatus(false);
            })
            .catch(error => {
                this.loadingService.setLoadingStatus(false);
                //TODO: Finish error handling
                console.log(error);
            });
    }

    navToChar(vModel: CharacterModel): void {
        this.router.navigate([`/characters/${vModel.Name}`]);
    }

    navToCharEdit(vModel: CharacterModel): void {
        this.router.navigate([`/characters/update/${vModel.Name}`]);
    }
}