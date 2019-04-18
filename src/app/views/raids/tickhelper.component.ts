import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DkpService } from '../../services/dkp.service';
import { LoadingDataService } from '../utilities/loading-data.service';
import { CognitoUtil } from '../../services/cognito.service';
import { BaseComponent } from '../base/base.component';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from "lodash";
import { UserRequest, RequestStatus, RequestType } from '../../models/UserRequest';

@Component({
    templateUrl: 'tickhelper.component.html'
})
export class TickHelperComponent extends BaseComponent implements OnInit {
    constructor(
        private dkpService: DkpService,
        router: Router,
        private route: ActivatedRoute,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        private modalService: BsModalService) {
        super(cognitoService, loadingService, router);
        this.CharacterName = this.route.snapshot.paramMap.get("name");
        this.setIsLoginRequired(true);
    }

    @ViewChild(ModalDirective) smallModal: ModalDirective;
    modalRef: BsModalRef;
    RaidList = [];
    public SelectedRaidTicks = [];
    public SelectedRaid: any;
    public isToggled: boolean = true;
    public CharacterName: string = "";
    public disabled: boolean = false;
    public LogData: string = "";
    private SelectedData: any = {};
    public Username: string = '';
    public PendingRequestList: UserRequest[];

    /**
     * On init we need to get the raids by the character and filter for any raids they were not 100% attendance on
     * NOTE: the getRaidsByCharacter api will NOT return a raid the character NEVER attended (0% attendance)
     */
    ngOnInit(): void {
        this.alerts = [];
        this.loadingService.setLoadingStatus(true);
        this.dkpService.getRaidsByCharacter(this.CharacterName, 30).then(results => {
            let filteredList = _.orderBy(results, x => { return x.Timestamp; }, ['desc', 'asc']);
            filteredList = _.filter(filteredList, x => {
                return x.TotalTicks != x.Ticks.length;
            })
            this.RaidList = _.cloneDeep(filteredList);
            this.loadingService.setLoadingStatus(false);
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });
    }

    /**
     * This gathers the needed data to present the Raid Tick information to user
     * @param row Raid data in which we pull Raid TIck information for
     */
    switchToTickView(row): void {
        this.loadingService.setLoadingStatus(true);
        this.toggleView();
        this.SelectedRaidTicks = [];
        this.SelectedRaid = row;
        this.cognitoService.getCurrentUser().subscribe(cognito => {
            this.Username = this.currentUser["cognito:username"];
            //Using the Cognito Username, let's get all of the users pending requests so we can see if there is already pending raid tick requests
            if (this.Username && this.Username.length > 0) {
                this.dkpService.getRequests(this.Username).then(result => {
                    //Filter for Pending Status and Raid Tick types
                    this.PendingRequestList = _.filter(result, x => x.RequestStatus == RequestStatus.PENDING && x.RequestType == RequestType["Raid Tick"]);
                    let vPendingTicks: number[] = [];

                    //Grab the Request details to parse the TickId
                    this.PendingRequestList.forEach(request => {
                        var obj = JSON.parse(request.RequestDetails);
                        vPendingTicks.push(obj.tickId);
                    });

                    //Now Grab all of the Ticks for this Raid Id
                    this.dkpService.getRaidbyId(row.IdRaid).then(results => {
                        results.Ticks.forEach(element => {
                            if (_.indexOf(element.Attendees, this.CharacterName) < 0) this.SelectedRaidTicks.push(element);
                        });

                        //If we already have a pending request for this Tick, Mark it on the Object so the view can ngIf on it
                        this.SelectedRaidTicks = _.clone(this.SelectedRaidTicks);
                        this.SelectedRaidTicks.forEach(tick => {
                            if ( vPendingTicks.indexOf(tick.TickId) > -1 ) {
                                tick.ActionPending = true;
                            }
                        });
                        this.loadingService.setLoadingStatus(false);
                    }).catch(error => {
                        console.log(error);
                        this.loadingService.setLoadingStatus(false);
                    });
                }).catch(error => {
                    console.log(error);
                    this.loadingService.setLoadingStatus(false);
                });
            }
        });
    }

    /**
     * Opens a Modal with Data to be presented to user
     * @param template Template type to open the modal in
     * @param row Data to be inejcted with the modal
     */
    openModal(template: TemplateRef<any>, row: any) {
        this.SelectedData = row;
        var config = {
            backdrop: true,
            ignoreBackdropClick: true
          };        
        this.modalRef = this.modalService.show(template, config);
      }    

    toggleView() {
        this.isToggled = !this.isToggled;
    }

    /**
     * Submit a Request of RaidTick type for Administrators to review
     * We pull user information from the Cognito API on the service side
     */
    submitRequest() {
        if ( !this.LogData || this.LogData.trim().length <= 0 ) {
            this.pushAlert("You must provide proof or reason for raid tick", 'danger');
            this.modalRef.hide();
            return;
        }
        this.loadingService.setLoadingStatus(true);
        this.disabled = true;

        var vRequest = new UserRequest();
        vRequest.RequestDetails = `{characterName:"${this.CharacterName}",tickId:${this.SelectedData.TickId},reason:"${this.LogData}"}`;
        vRequest.RequestType = UserRequest.TYPE_RAIDTICK;

        this.dkpService.putRequest(vRequest).then( result => {
            this.alerts.push({
                type: 'success',
                msg: `Request submitted successfully, please wait for administrator to review...`
            });            
            this.loadingService.setLoadingStatus(false);
            this.LogData = '';
            this.SelectedData.ActionPending = true;
            this.disabled = false;
        }).catch(error => {
            this.loadingService.setLoadingStatus(false);
            this.disabled = false;            
            this.alerts.push({
                type: 'danger',
                msg: `${error.response.data.ErrorMessage}`
            });
        });
        this.modalRef.hide();   
    }
}