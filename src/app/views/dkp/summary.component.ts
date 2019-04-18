import { Component, OnInit } from '@angular/core';
import { DkpService } from '../../services/dkp.service';
import { SummaryModel } from '../../models/SummaryModel';
import { PlayerSummaryModel } from '../../models/PlayerSummaryModel';
import { LoadingDataService } from '../utilities/loading-data.service';
import { CookieService } from 'ngx-cookie-service';
import * as _ from "lodash";
import { ClientService } from '../../services/client.service';
import { ClientModel } from '../../models/ClientModel';
import { SummaryCardModel } from '../../models/SummaryCardsModel';

@Component({
    styles: [`
            .ngx-datatable.bootstrap {
                box-shadow: none;
                font-size: 13px;
                color: #0a5;
            }       
            @media screen and (max-width: 800px) {
            .desktop-hidden {
                display: initial;
            }
            .mobile-hidden {
                display: none;
            }
            }
            @media screen and (min-width: 800px) {
            .desktop-hidden {
                display: none;
            }
            .mobile-hidden {
                display: initial;
            }
            }
            .back-image {
                background-image: url('../../../assets/img/brand/rallos.jpg');
                background-position-x: center, center;
                background-position-y: top, bottom;
                background-size: 1920px, 1920px;
                background-repeat-x: no-repeat;
                background-repeat-y: no-repeat;
                background-attachment: scroll, scroll;
                background-color: rgb(0, 0, 0);                                
            }          
            `],
    templateUrl: 'summary.component.html'
})
export class SummaryComponent implements OnInit {
    constructor(private clientService: ClientService,
        private dkpService: DkpService,
        private loadingService: LoadingDataService,
        private cookieService: CookieService) {
            this.cookieDate = new Date(this.cookieDate.getFullYear()+1,this.cookieDate.getMonth());
            this.clientDetails = this.clientService.clientDetails;
        }
    fModel: SummaryModel = new SummaryModel();
    fOriginalModel: SummaryModel = new SummaryModel();
    modelArray: any[] = [];
    pageLimit: number = 50;
    rankArray: Set < any > = new Set();
    classArray: Set < any > = new Set();
    cookieDate: Date = new Date();
    clientDetails: ClientModel;
    scModel: SummaryCardModel;

    ngOnInit(): void {
        this.loadingService.setLoadingStatus(true);
        var vSummaryPromise = this.dkpService.getSummary();
        var vSettingsPromise = this.dkpService.getSetting('summary_card');

        Promise.all([vSummaryPromise, vSettingsPromise]).then( results => {
            var vSummaryModels = results[0];
            var settingsModel = JSON.parse(results[1]);
            if (settingsModel.SettingValue) {
                this.scModel = JSON.parse(settingsModel.SettingValue);
            }

            //Grab all of the possible Classes and Ranks
            vSummaryModels.Models.forEach(x => {
                x.CurrentDKP = Number((x.CurrentDKP).toFixed(1));
                if ( x.CharacterRank=='Godfather' || x.CharacterRank=='Caporegime' || x.CharacterRank=='Underboss' || x.CharacterRank=='Consigliere') x.CharacterRank = 'Made Man';
                this.classArray.add(x.CharacterClass);
                this.rankArray.add(x.CharacterRank);
            });

            var vCheckedRanks, vCheckedClasses;
            if (this.cookieService.check('checkedRanks')) vCheckedRanks = JSON.parse(this.cookieService.get('checkedRanks'));
            if (this.cookieService.check('checkedClasses')) vCheckedClasses = JSON.parse(this.cookieService.get('checkedClasses'));
            if (this.cookieService.check('pageLimit')) this.pageLimit = JSON.parse(this.cookieService.get('pageLimit'));

            //Apply Cookie Settings if needed
            let tmp: Set < any > = new Set();
            this.rankArray.forEach(rank => {
                if (vCheckedRanks)
                    tmp.add({ CharacterRank: rank, IsChecked: (_.indexOf(vCheckedRanks, rank) > -1) });
                else
                    tmp.add({ CharacterRank: rank, IsChecked: true });
            })
            this.rankArray = _.clone(tmp);
            tmp = new Set();
            this.classArray.forEach(element => {
                if (vCheckedClasses)
                    tmp.add({ CharacterClass: element, IsChecked: (_.indexOf(vCheckedClasses, element) > -1) });
                else
                    tmp.add({ CharacterClass: element, IsChecked: true });
            })
            this.classArray = _.clone(tmp);

            this.fModel.Models = _.orderBy(vSummaryModels.Models, x => { return x.Calculated_30; }, ['desc', 'asc']);
            this.fOriginalModel = _.cloneDeep(this.fModel);

            this.modelArray.push({ class: "Bard", style: { 'color': 'white', 'background-color': 'rgb(32, 212, 190)' }, top: this.getFormattedArray("Bard") });
            this.modelArray.push({ class: "Beastlord", style: { 'color': 'white', 'background-color': 'rgb(179, 181, 22)' }, top: this.getFormattedArray("Beastlord") });
            this.modelArray.push({ class: "Berserker", style: { 'color': 'white', 'background-color': 'rgb(10, 43, 209)' }, top: this.getFormattedArray("Berserker") });
            this.modelArray.push({ class: "Cleric", style: { 'color': 'white', 'background-color': 'rgb(48, 56, 140)' }, top: this.getFormattedArray("Cleric") });
            this.modelArray.push({ class: "Druid", style: { 'color': 'white', 'background-color': 'rgb(57, 179, 67)' }, top: this.getFormattedArray("Druid") });
            this.modelArray.push({ class: "Enchanter", style: { 'color': 'white', 'background-color': 'rgb(0, 165, 169)' }, top: this.getFormattedArray("Enchanter") });
            this.modelArray.push({ class: "Magician", style: { 'color': 'white', 'background-color': 'rgb(22, 126, 141)' }, top: this.getFormattedArray("Magician") });
            this.modelArray.push({ class: "Monk", style: { 'color': 'white', 'background-color': 'rgb(164, 87, 17)' }, top: this.getFormattedArray("Monk") });
            this.modelArray.push({ class: "Necromancer", style: { 'color': 'white', 'background-color': 'rgb(91, 48, 140)' }, top: this.getFormattedArray("Necromancer") });
            this.modelArray.push({ class: "Paladin", style: { 'color': 'white', 'background-color': 'rgb(172, 58, 150)' }, top: this.getFormattedArray("Paladin") });
            this.modelArray.push({ class: "Ranger", style: { 'color': 'white', 'background-color': 'rgb(21, 111, 29)' }, top: this.getFormattedArray("Ranger") });
            this.modelArray.push({ class: "Rogue", style: { 'color': 'white', 'background-color': 'rgb(140, 140, 48)' }, top: this.getFormattedArray("Rogue") });
            this.modelArray.push({ class: "Shadow Knight", style: { 'color': 'white', 'background-color': 'rgb(140, 48, 48)' }, top: this.getFormattedArray("Shadow Knight") });
            this.modelArray.push({ class: "Shaman", style: { 'color': 'white', 'background-color': 'rgb(100, 46, 6)' }, top: this.getFormattedArray("Shaman") });
            this.modelArray.push({ class: "Warrior", style: { 'color': 'white', 'background-color': 'rgb(148, 107, 41)' }, top: this.getFormattedArray("Warrior") });
            this.modelArray.push({ class: "Wizard", style: { 'color': 'white', 'background-color': 'rgb(148, 19, 19)' }, top: this.getFormattedArray("Wizard") });

            this.applyFilters();

            this.loadingService.setLoadingStatus(false);

        });
    }

    /**
     * Applies appropriate filters to the collection set fModel.Models
     */
    applyFilters() {
        let vAvailableClasses = [];
        let vAvailableRanks = [];

        this.classArray.forEach(x => {
            if (x.IsChecked) vAvailableClasses.push(x.CharacterClass);
        })
        this.rankArray.forEach(x => {
            if (x.IsChecked) vAvailableRanks.push(x.CharacterRank);
        })

        //Store Cookie Information
        if (vAvailableRanks.length > 0) this.cookieService.set('checkedRanks', JSON.stringify(vAvailableRanks), this.cookieDate);
        if (vAvailableClasses.length > 0) this.cookieService.set('checkedClasses', JSON.stringify(vAvailableClasses), this.cookieDate);

        this.fModel.Models = _.filter(this.fOriginalModel.Models, model => {
            return _.indexOf(vAvailableClasses, model.CharacterClass) > -1 && _.indexOf(vAvailableRanks, model.CharacterRank) > -1;
        });

    }

    selectAllRanks() { this.rankArray.forEach(x => x.IsChecked = true) }
    clearAllRanks() { this.rankArray.forEach(x => x.IsChecked = false) }
    selectAllClass() { this.classArray.forEach(x => x.IsChecked = true) }
    clearAllClass() { this.classArray.forEach(x => x.IsChecked = false) }

    getFormattedArray(pClass: string): PlayerSummaryModel[] {
        var vArrayModel;
        if ( this.clientDetails.Subdomain === 'ogc') {
            vArrayModel = _.filter(this.fModel.Models, x => { return x.CharacterClass == pClass && x.Calculated_30 >= 0.395 && 
                (x.CharacterRank == "Made Man" || x.CharacterRank == "Godfather" || x.CharacterRank == "Caporegime" || x.CharacterRank == "Consigliere" || x.CharacterRank == "Underboss" || x.CharacterRank == "Member"); 
            });
        } else {
            vArrayModel = _.filter(this.fModel.Models, x => {
                if ( this.scModel && this.scModel.Ranks.length > 0 ) {
                    return (x.CharacterClass == pClass && this.scModel.Ranks.toLowerCase().indexOf(x.CharacterRank.toLowerCase()) > -1); 
                } else {
                    return x.CharacterClass == pClass; 
                }
            });            
        }
        vArrayModel = _.orderBy(vArrayModel, x => { return x.CurrentDKP; }, ['desc', 'asc']);
        if ( this.scModel && this.scModel.ListSize > 0 ) {
            vArrayModel = _.slice(vArrayModel, 0, this.scModel.ListSize);
        } else {
        vArrayModel = _.slice(vArrayModel, 0, 5);
        }
        return vArrayModel;
    }

    onPageChange(event) {
        this.cookieService.set('pageLimit', JSON.stringify(event), this.cookieDate);
    }
}