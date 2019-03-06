import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { DkpService } from '../../services/dkp.service';
import { CharacterModel } from '../../models/CharacterModel';
import { Config } from '../../models/Config';
import { LoadingDataService } from '../utilities/loading-data.service';
import { CognitoUtil } from '../../services/cognito.service';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';


export function getAlertConfig(): AlertConfig {
    return Object.assign(new AlertConfig(), { type: 'success' });
}

@Component({
    templateUrl: 'insert.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: AlertConfig, useFactory: getAlertConfig }]
})
export class InsertCharacterComponent extends BaseComponent implements OnInit {
    constructor(private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
    }

    classes = Config.Classes;
    races = Config.Races;

    model = new CharacterModel('Moncy', 'Member', Config.Classes[0], 75, 'Dark Elf', 'Male');
    disabled = false;

    onSubmit(): void {
        this.loadingService.setLoadingStatus(true);
        this.disabled = true;
        this.alerts = [];

        this.dkpService.insertCharacter(this.model).then(x => {
            this.disabled = false;
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'success',
                msg: `${this.model.Name} has been added successfully!`
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

    ngOnInit(): void {
        this.model = new CharacterModel('Moncy', 'Member', Config.Classes[0], 75, 'Dark Elf', 'Male');
    }

    newCharacter(): void {
        console.log(Config.Classes[0]);
        this.alerts = [];
        this.model = new CharacterModel('Moncy', 'Member', Config.Classes[0], 75, 'Dark Elf', 'Male');
    }
}