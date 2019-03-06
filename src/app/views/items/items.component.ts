import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DkpService } from '../../services/dkp.service';
import { ItemListModel } from '../../models/ItemListModel';
import { LoadingDataService } from '../utilities/loading-data.service';
import { BaseComponent } from '../base/base.component';
import { CognitoUtil } from '../../services/cognito.service'
import * as _ from "lodash";

@Component({
    templateUrl: 'items.component.html'
})
export class ItemsComponent extends BaseComponent implements OnInit {
    constructor(private dkpService: DkpService,
        router: Router,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil) {
        super(cognitoService, loadingService, router);
    }
    public ItemList: ItemListModel[] = [];
    private OriginalItemList: ItemListModel[] = [];
    public filterBy: string;

    ngOnInit(): void {
        this.loadingService.setLoadingStatus(true);
        this.dkpService.getAllItems()
            .then(x => {
                x = _.orderBy(x, x => { return x.Timestamp; }, ['desc', 'asc']);
                this.ItemList = x;
                this.OriginalItemList = _.cloneDeep(x);
                this.loadingService.setLoadingStatus(false);
            })
            .catch(error => {
                //TODO: Finish error handling
                console.log(error);
            });
    }

    onKey(event) {
        if (this.filterBy && this.filterBy.length > 0) {
            this.ItemList = _.filter(this.OriginalItemList, model => {
                return ( model.ItemName && model.ItemName.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1) ||
                       ( model.CharacterName && model.CharacterName.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
            });
        } else {
            this.ItemList = _.cloneDeep(this.OriginalItemList);
        }
    }
}