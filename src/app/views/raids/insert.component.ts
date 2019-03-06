import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { ModalDirective, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TickModalComponent } from '../modals/tickmodal.component';
import { TickModel } from '../../models/TickModel';
import * as _ from "lodash";
import { RaidModel } from '../../models/RaidModel';
import { PoolModel } from '../../models/PoolModel';
import { ItemModel } from '../../models/ItemModel';
import { DkpService } from '../../services/dkp.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { CognitoUtil } from '../../services/cognito.service';
import { BaseComponent } from '../base/base.component';

export function getAlertConfig(): AlertConfig {
    return Object.assign(new AlertConfig(), { type: 'success' });
}

@Component({
    templateUrl: 'insert.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: AlertConfig, useFactory: getAlertConfig }]
})

export class InsertRaidComponent extends BaseComponent implements OnInit {
    constructor(private modalService: BsModalService,
        private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router,
        private route: ActivatedRoute) {
        super(cognitoService, loadingService, router);
        this.setProtectedPage(true);
        this.searchedItems = Observable.create((observer: any) => {
            observer.next(this.newItem.ItemName);
        }).pipe(mergeMap((token: string) => this.dkpService.searchItems(token)));

        this.searchedCharacters = Observable.create((observer: any) => {
            observer.next(this.newItem.CharacterName);
        }).pipe(mergeMap((token: string) => this.getNames(token)));
    }

    getNames(token) {
        return new Promise((resolve, reject) => {
            var union = [];
            this.raidModel.Ticks.forEach(tick => {
                union = _.union(Array.from(tick.Attendees), union);
            });
            union = _.filter(union, x => x.toLowerCase().indexOf(token.toLowerCase()) > -1);
            resolve(union);
        });
    }

    @Input() raidModel: RaidModel;
    @ViewChild(ModalDirective) smallModal: ModalDirective;

    bsModalRef: BsModalRef;
    disabled = false;
    public bsValue = new Date();
    public userTickDate = new Date().toLocaleDateString();
    public isItemLoading: boolean = false;
    pools: PoolModel[] = [];
    selectedTick: TickModel;
    tickName: string;
    newItem: ItemModel;
    searchedItems: Observable < any > ;
    searchedCharacters: Observable < any > ;
    bulkItems: string = '';
    public filterBy: string;
    public FilteredItems: any[] = [];

    onKey(event) {
        if (this.filterBy && this.filterBy.length > 0) {
            this.FilteredItems = _.filter(this.raidModel.Items, model => {
                return (model.ItemName && model.ItemName.length > 0 && model.ItemName.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1) ||
                    (model.CharacterName && model.CharacterName.length > 0 && model.CharacterName.toLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
            });
        } else {
            this.FilteredItems = _.cloneDeep(this.raidModel.Items);
        }
    }

    typeaheadOnSelect(e: TypeaheadMatch): void {
        this.newItem.ItemName = e.item.ItemName;
        this.newItem.ItemID = e.item.ItemID;
    }

    typeaheadOnSelectCharName(e: TypeaheadMatch): void {
        //this.newItem.CharacterName = e.item;
    }

    changeTypeaheadLoading(e: boolean): void {
        this.isItemLoading = e;
    }

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
            this.raidModel.Items = []; //new Set < ItemModel > ();
        }

        if (this.route.snapshot.params.id) {
            this.disabled = true;
            this.loadingService.setLoadingStatus(true);
            this.dkpService.getRaidbyId(this.route.snapshot.params.id).then(raid => {
                this.raidModel = raid;
                this.handleSpecialSerialization(raid);
                this.disabled = false;
                this.loadingService.setLoadingStatus(false);
            }).catch(error => {
                console.log(error);
            });
        }

        //Fetch DKP Pools
        this.dkpService.getAllPools().then(pools => {
            this.pools = pools;
        }).catch(error => {
            console.log(error);
        });
    }

    handleSpecialSerialization(raid) {
        this.raidModel.Ticks = new Set < TickModel > (raid.Ticks);
        this.raidModel.Ticks.forEach(x => x.Attendees = new Set < string > (x.Attendees));
        raid.Items = _.orderBy(raid.Items, x => { return x.CharacterName; });
        //this.raidModel.Items = new Set < ItemModel > (raid.Items);
        this.raidModel.Timestamp = new Date(raid.Timestamp);
    }

    compareFn(c1: PoolModel, c2: PoolModel): boolean {
        return c1 && c2 ? c1.IdPool === c2.IdPool : c1 === c2;
    }

    /**
     * Simply create an empty raid tick setting only the tick name
     */
    createEmptyTick() {
        if (this.tickName && this.tickName.trim()) {
            this.tickName = this.tickName.trim();
            var tick = new TickModel();
            tick.Description = this.tickName;
            this.raidModel.Ticks.add(tick);
        }
    }

    /**
     * Removes the selected raid tick and sets the first raid tick in the
     * collection to the selectedTick, maybe set to last or don't do at all?
     */
    removeRaidTick() {
        if (this.selectedTick && this.raidModel.Ticks) this.raidModel.Ticks.delete(this.selectedTick);
        if (this.raidModel.Ticks.size > 0) {
            this.selectedTick = this.raidModel.Ticks.values().next().value;
        }
    }

    /**
     * Clone the selected raid tick
     */
    cloneTick() {
        if (this.selectedTick) {
            let newTick = _.cloneDeep(this.selectedTick);
            newTick.Description = "COPY OF " + newTick.Description;
            this.raidModel.Ticks.add(newTick);
            this.selectedTick = newTick;
        }
    }

    /**
     * This will open the Modal for User to Edit Raid Tick
     * @param tick the raid tick which is to be editted within the modal
     */
    showModal(tick) {
        const initialState = {
            tickModel: tick
        };
        this.bsModalRef = this.modalService.show(TickModalComponent, { initialState, class: 'modal-lg', ignoreBackdropClick: true });
    }

    /**
     * CLEAN THIS UP
     */
    generateTemplate() {
        this.raidModel.Ticks.add(new TickModel("On-Time Tick 6:00PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 6:30PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 7:00PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 7:30PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 8:00PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 8:30PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 9:00PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 9:30PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 10:00PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 10:30PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 11:00PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 11:30PM CST"));
        this.raidModel.Ticks.add(new TickModel("Tick 12:00AM CST"));
    }

    /**
     * Need to perform validation before submitting the raid
     * Could probably use form validation but we'll use this for now
     */
    saveRaid() {
        this.alerts = [];
        this.raidModel.Name = this.raidModel.Name.trim();

        //Validate Raid Name
        if (this.raidModel.Name.length <= 0) {
            this.pushErrorMessage('You must specify a raid name, it doesn\'t have to be unique');
        }

        //Validate Raid Pool
        if (!this.raidModel.Pool || this.raidModel.Pool.Name.length <= 0) {
            this.pushErrorMessage('You must select a DKP Raid Pool from the drop down menu');
        }

        //Validate we have Raid Ticks
        if (this.raidModel.Ticks.size <= 0) {
            this.pushErrorMessage('You need to add Raid Ticks before you Save a raid');
        }
        this.raidModel.Ticks.forEach(element => {
            if (element.Value <= 0) this.pushErrorMessage(element.Description + ' has no dkp value. This would cause attendees to receive attendance ticks but no DKP associated with tick.');
            if (element.Attendees.size <= 0) this.pushErrorMessage(element.Description + ' has no attendees, should have at least 1 attendee or delete this tick. Having a tick with no attendees would cause EVERYONE to miss a raid tick and skew attendance.');
        });

        /*
        //Validate that the people getting loot attended the raid: TODO: Is this the best way?
        var union = [];
        this.raidModel.Ticks.forEach(tick => {
            union = _.union(Array.from(tick.Attendees), union);
        });
        this.raidModel.Items.forEach(element => {
           if( union.findIndex( x => x.toLowerCase() === element.CharacterName.toLowerCase()) == -1 ) {
                this.pushErrorMessage(`${element.CharacterName} is being charged for loot but is not present in any raid ticks, is the name correct?`);
           }
        });
        return;
        */

        //I edit the model before I send it over the wire because
        //something odd happens with Set serialization
        let model = _.cloneDeep(this.raidModel);
        model.Ticks = Array.from(this.raidModel.Ticks);
        model.Ticks.forEach(x => {
            x.Attendees = Array.from(x.Attendees);
        });
        model.Items = Array.from(this.raidModel.Items);


        //No Errors, lets process
        if (this.alerts.length <= 0) {
            this.loadingService.setLoadingStatus(true);
            this.disabled = true;
            model.UpdatedBy = this.currentUser["cognito:username"];
            model.UpdatedTimestamp = new Date();

            if (model.IdRaid) {
                this.dkpService.updateRaid(model).then(returnedRaid => {
                    this.raidModel.IdRaid = returnedRaid.IdRaid;
                    this.disabled = false;
                    this.loadingService.setLoadingStatus(false);
                    this.alerts.push({
                        type: 'success',
                        msg: `Raid has been successfully updated...`
                    });
                }).catch(error => {
                    this.disabled = false;
                    this.loadingService.setLoadingStatus(false);
                    this.alerts.push({
                        type: 'danger',
                        msg: `${error.response.data.ErrorMessage}`
                    });
                });
            } else {
                this.dkpService.insertRaid(model).then(returnedRaid => {
                    this.raidModel.IdRaid = returnedRaid.IdRaid;
                    this.disabled = false;
                    this.loadingService.setLoadingStatus(false);
                    this.alerts.push({
                        type: 'success',
                        msg: `Raid has been successfully saved...`
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
        }
    }

    addItem() {
        if (this.newItem && 
            this.newItem.CharacterName && this.newItem.CharacterName.length > 0 &&
            this.newItem.ItemName && this.newItem.ItemName.length > 0 &&
            this.newItem.DkpValue) {

            this.newItem.CharacterName.trim();
            this.newItem.ItemName.trim();
            this.bulkItems = '';
            if (this.newItem && this.newItem.ItemName.length > 0 && this.newItem.CharacterName.length > 0 && this.newItem.DkpValue >= 0) {
                if (!this.newItem.ItemID) {
                    this.dkpService.searchItems(this.newItem.ItemName, 1).then(result => {
                        if (result.length > 0) {
                            this.newItem.ItemID = result[0].ItemID;
                            this.newItem.ItemName = result[0].ItemName;
                            this.raidModel.Items.push(_.cloneDeep(this.newItem));
                            this.newItem = new ItemModel();
                        } else {
                            this.newItem.ItemID = -1;
                            this.raidModel.Items.push(_.cloneDeep(this.newItem));
                            this.newItem = new ItemModel();
                            this.alerts.push({
                                type: 'warning',
                                msg: `${this.newItem.ItemName} was not found in the Item DB, it will be added.`
                            });
                        }
                        this.raidModel.Items = _.orderBy(this.raidModel.Items, x => { return x.CharacterName; });
                        this.FilteredItems = _.cloneDeep(this.raidModel.Items);
                        this.filterBy = '';
                    }).catch(error => {
                        this.newItem.ItemID = -1;
                        this.raidModel.Items.push(_.cloneDeep(this.newItem));
                        this.newItem = new ItemModel();
                        this.alerts.push({
                            type: 'error',
                            msg: `${this.newItem.ItemName} : ERROR=${error}`
                        });
                    });
                } else {
                    this.raidModel.Items.push(_.cloneDeep(this.newItem));
                    this.newItem = new ItemModel();
                    this.raidModel.Items = _.orderBy(this.raidModel.Items, x => { return x.CharacterName; });
                    this.FilteredItems = _.cloneDeep(this.raidModel.Items);
                    this.filterBy = '';
                }
            } else {
                this.pushErrorMessage('You must specify an item name, character name, and DKP value to add an item!');
            }
        }
    }

    removeItem(pItemModel: any) {
        if (pItemModel) {
            var vRemoveIndex = _.findIndex(this.raidModel.Items, (x:any) => {
                return x.ItemID==pItemModel.ItemID && x.CharacterName==pItemModel.CharacterName;
            });
            console.log(vRemoveIndex);
            if ( vRemoveIndex > -1 ) {
                this.raidModel.Items.splice(vRemoveIndex,1);
                this.filterBy = '';
                this.raidModel.Items = _.orderBy(this.raidModel.Items, x => { return x.CharacterName; });
                this.FilteredItems = _.cloneDeep(this.raidModel.Items);                
            }  
        }
    }
    updateItem(pItemModel: any) {
        this.removeItem(pItemModel);
        this.newItem = _.clone(pItemModel);
    }

    bulkAddItems() {
        this.disabled = true;
        var vLineTokens = this.bulkItems.split(/[\r\n]+/);
        this.bulkItems = '';
        var itemSet = new Set < string > ();
        var itemModels = [];
        vLineTokens.forEach(line => {
            //Clean up the Input, remove all of the timestamp and character name etc
            line = line.toLowerCase();

            //If this line contains the word REMOVE, means we have an issue with the awarding of the item
            if ( line.indexOf("remove") > -1 ) {
                this.bulkItems += line + `\n`;
                this.pushErrorMessage(`Detected REMOVE in gratss message! Make sure the character wasn't double charged! This instance has been added back to the buil item list textbox`);                    
                return;
            }

            if (line.indexOf('gratss') > 0) line = line.substring(0, line.indexOf("gratss"));
            if (line.indexOf('guild, \'') > 0) line = line.substring(line.indexOf('guild, \'') + 8);

            //parse the remaining string which should be: itemname ; dkp value ; character name
            var vBidElements = line.split(';');
            var vItem: ItemModel = new ItemModel();
            if (vBidElements.length > 2) {
                vItem.ItemName = vBidElements[0].trim();
                vItem.DkpValue = parseInt(vBidElements[1].trim().split(' ')[0]);
                vItem.CharacterName = vBidElements[2].trim().split(' ')[0];
                 if (!isNaN(vItem.DkpValue)) {
                    itemModels.push(vItem);
                    itemSet.add(vItem.ItemName);
                } else {
                    this.bulkItems += line + `\n`;
                    this.pushErrorMessage(`${vItem.ItemName} has an invalid dkp value, please fix it!`);
                }
            } else {
                this.bulkItems += line + `\n`;
                this.pushErrorMessage(`There was an issue detected with an item, it has been added back to the bulk item list textbox`);
            }
        });

        this.dkpService.searchItemsPost(Array.from(itemSet)).then(results => {
            itemModels.forEach(model => {
                var index = _.findIndex(results, (x: any) => { return x.ItemName.toLowerCase() === model.ItemName });
                if (index > -1) {
                    model.ItemID = results[index].ItemID;
                    model.ItemName = results[index].ItemName;
                    this.raidModel.Items.push(model);
                } else {
                    this.bulkItems += `${model.ItemName};${model.DkpValue};${model.CharacterName}\n`;
                    this.pushErrorMessage(`${model.ItemName} was not found in the DB, you may have to add this using the Manual tab!`);
                }
            });
            this.raidModel.Items = _.orderBy(this.raidModel.Items, x => { return x.CharacterName; });
            this.FilteredItems = _.cloneDeep(this.raidModel.Items);
            this.filterBy = '';
            this.disabled = false;
        }).catch(error => {
            console.log(error);
            this.disabled = false;
        });
    }

    deleteRaid() {
        this.smallModal.hide();
        this.loadingService.setLoadingStatus(true);
        this.smallModal.hide();
        this.disabled = true;
        this.dkpService.deleteRaid(this.raidModel.IdRaid).then(returnedRaid => {
            this.loadingService.setLoadingStatus(false);
            this.navToRaids();
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.disabled = false;
            this.alerts.push({
                type: 'danger',
                msg: `Couldn't delete Raid: ${error}`
            });
        });
    }

    navToRaids() {
        this.router.navigate(['/raids']);
    }

    //TODO: remove ths I should have this in base
    pushErrorMessage(pErrorMessage: string) {
        this.alerts.push({
            type: 'danger',
            msg: `${pErrorMessage}`
        });
    }
}