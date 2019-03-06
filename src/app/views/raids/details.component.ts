import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { ModalDirective, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TickModalComponent } from '../modals/tickmodal.component';
import { TickModel } from '../../models/TickModel';
import * as _ from "lodash";
import { RaidModel } from '../../models/RaidModel';
import { PoolModel } from '../../models/PoolModel';
import { ItemModel } from '../../models/ItemModel';
import { DkpService } from '../../services/dkp.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { CognitoUtil } from '../../services/cognito.service';
import { BaseComponent } from '../base/base.component';

export function getAlertConfig(): AlertConfig {
    return Object.assign(new AlertConfig(), { type: 'success' });
}

@Component({
    templateUrl: 'details.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: AlertConfig, useFactory: getAlertConfig }]
})

export class RaidDetailsComponent extends BaseComponent implements OnInit {
    constructor(private modalService: BsModalService,
        private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router,
        private route: ActivatedRoute) {
        super(cognitoService, loadingService, router);
    }

    @Input() raidModel: RaidModel;
    @ViewChild(ModalDirective) smallModal: ModalDirective;

    bsModalRef: BsModalRef;
    disabled = false;
    public bsValue = new Date();
    public userTickDate = new Date().toLocaleDateString();

    selectedTick: TickModel;
    newItem: ItemModel;
    searchedItems: Observable < any > ;


    /**
     * For initialization we need to fetch DKP Pools and initialize Raid Model
     */
    ngOnInit(): void {
        this.newItem = new ItemModel();
        //Init RaidModel
        if (!this.raidModel) {
            this.raidModel = new RaidModel();
            this.raidModel.Name = "";
            this.raidModel.Timestamp = new Date();
            this.raidModel.Ticks = new Set < TickModel > ();
            this.raidModel.Items = new Set < ItemModel > ();
            this.raidModel.Pool = new PoolModel();
        }

        if (this.route.snapshot.params.id) {
            this.disabled = true;
            this.loadingService.setLoadingStatus(true);
            this.dkpService.getRaidbyId(this.route.snapshot.params.id).then(raid => {
                this.raidModel = raid;
                this.raidModel.Ticks = new Set < TickModel > (raid.Ticks);
                this.raidModel.Ticks.forEach(x => {
                    x.Attendees.sort();
                    x.Attendees = new Set < string > (x.Attendees);
                });
                this.raidModel.Items.sort();
                this.raidModel.Items = _.orderBy(this.raidModel.Items, x => { return x.CharacterName; });
                this.raidModel.Items = new Set < ItemModel > (raid.Items);
                this.raidModel.Timestamp = new Date(raid.Timestamp);
                console.log(this.raidModel);
                this.disabled = false;
                this.loadingService.setLoadingStatus(false);
            }).catch(error => {
                //TODO: finish error handling
                console.log(error);
            });
        }
    }

    compareFn(c1: PoolModel, c2: PoolModel): boolean {
        return c1 && c2 ? c1.IdPool === c2.IdPool : c1 === c2;
    }

    navToRaidEdit() {
        this.router.navigate([`/raids/insert/${this.raidModel.IdRaid}`]);
    }

    /**
     * This will open the Modal for User to Edit Raid Tick
     * @param tick the raid tick which is to be editted within the modal
     */
    showModal(tick) {
        const initialState = {
            tickModel: tick
        };
        this.bsModalRef = this.modalService.show(TickModalComponent, { initialState, class: 'modal-lg' });
    }
}