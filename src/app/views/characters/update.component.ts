import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { DkpService } from '../../services/dkp.service';
import { CharacterModel } from '../../models/CharacterModel';
import { Config } from '../../models/Config';
import { LoadingDataService } from '../utilities/loading-data.service';
import { CognitoUtil } from '../../services/cognito.service';
import { BaseComponent } from '../base/base.component';

export function getAlertConfig(): AlertConfig {
    return Object.assign(new AlertConfig(), { type: 'success' });
}

@Component({
    templateUrl: 'update.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: AlertConfig, useFactory: getAlertConfig }]
})
export class UpdateCharacterComponent extends BaseComponent implements OnInit {
    constructor(
        private dkpService: DkpService,
        router: Router,
        private route: ActivatedRoute,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
    }

    classes = Config.Classes;
    races = Config.Races;
    model = new CharacterModel('Loading...', 'Member', this.classes[0], 0, 'Human', 'Male');
    disabled = false;
    alerts: any = [];

    onSubmit(): void {
        this.loadingService.setLoadingStatus(true);
        this.disabled = true;
        this.alerts = [];
        this.dkpService.updateCharacter(this.model).then(character => {
            this.disabled = false;
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'success',
                msg: `${this.model.Name} has been updated successfully!`
            });
        }).catch(error => {
            this.disabled = false;
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'danger',
                msg: `${error}`
            });
        });
    }

    ngOnInit(): void {
        var charName = this.route.snapshot.paramMap.get("name");
        this.dkpService.getCharacter(charName).then(character => {
            this.model = character;
        }).catch(error => {
            this.alerts.push({
                type: 'danger',
                msg: `${error}`
            });
        });
    }

    navToChar(): void {
        this.router.navigate([`/characters/${this.model.Name}`]);
    }
}