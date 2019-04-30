import { Component, ViewChild, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { LoadingDataService } from '../../views/utilities/loading-data.service'
import { CognitoUtil } from '../../services/cognito.service'
import { delay } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective, BsModalService } from 'ngx-bootstrap/modal';
import { DkpInfoModalComponent } from '../../views/modals/dkpinfomodal.component';
import { DKPInfoModel } from '../../models/DKPInfoModel';
import { DkpService } from '../../services/dkp.service';
import { SettingsModel } from '../../models/SettingsModel';
import { BaseComponent } from '../../views/base/base.component';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { ClientService } from '../../services/client.service';
import { ClientModel } from '../../models/ClientModel';
import { DemoModalComponent } from '../../views/modals/demomodal.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent extends BaseComponent implements OnInit {
    public clientDetails: ClientModel;
    public sideNavItems = navItems;
    public doOnce = false;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement = document.body;
    public isLoading: boolean = false;
    public isAuthenticated: boolean = false;
    public settingsModel: SettingsModel;
    public dkpInfoModel: DKPInfoModel = new DKPInfoModel();
    @ViewChild(ModalDirective) smallModal: ModalDirective;
    bsModalRef: BsModalRef;
    public requestCount: number = 0;
    public clientLogo: any = { src: 'assets/img/brand/opendkp-white-logo.png', width: 120, height: 45, alt: 'OGC' };

    constructor(private modalService: BsModalService,
        private clientService: ClientService,
        private dkpService: DkpService,
        loadingService: LoadingDataService,
        cognitoService: CognitoUtil,
        router: Router) {
        super(cognitoService, loadingService, router);
        this.clientDetails = this.clientService.clientDetails;
        if (this.clientDetails.Subdomain === 'ogc') this.clientLogo = { src: 'assets/img/brand/logo.png', width: 120, height: 45, alt: 'OGC' };
        if (this.clientDetails.Subdomain === 'demo') this.showDemoModal();

        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized')
        });

        this.changes.observe( < Element > this.element, {
            attributes: true
        });

        this.dkpService.getSetting("dkp_info").then(result => {
            this.settingsModel = JSON.parse(result);
            if (this.settingsModel.SettingValue)
                this.dkpInfoModel = JSON.parse(this.settingsModel.SettingValue);
            else
                this.dkpInfoModel = new DKPInfoModel();
        }).catch(error => {
            this.dkpInfoModel = new DKPInfoModel();
            console.log(error);
        });

        this.cognitoService.isAuthenticated().subscribe(x => { this.isAuthenticated = x; });
    }

    showDkpModal() {
        const initialState = {
            inputModel: this.dkpInfoModel
        };

        this.bsModalRef = this.modalService.show(DkpInfoModalComponent, { initialState, class: 'modal-dialog modal-primary' });
    }

    showDemoModal() {
        this.bsModalRef = this.modalService.show(DemoModalComponent, { class: 'modal-dialog modal-primary' });
    }    

    ngOnInit(): void {
        this.loadingService.getIsLoading().pipe(delay(10)).subscribe(x => this.isLoading = x);
        this.cognitoService.isDkpAdmin().subscribe(x => {
            if (x && !this.doOnce) {
                this.sideNavItems.push({ title: true, name: 'Admin' });
                this.sideNavItems.push({ name: 'Requests', url: '/admin', icon: 'fa fa-lock' });
                this.sideNavItems.push({ name: 'Roster Updates', url: '/admin/roster', icon: 'fa fa-lock' });
                this.sideNavItems.push({ name: 'DKP Admins', url: '/admin/usergroups', icon: 'fa fa-lock' });
                this.doOnce = true;
            } else {
                //TODO: currently a bug with core ui, you can't remove elements or restore the assignment for nav bar
            }
        });
        this.dkpService.getAllRequests().then(result => {
        }).catch(error => {
            console.log(error);
        });
        this.dkpService.pendingRequests().subscribe(x => this.requestCount = x);
    };

    logout(): void {
        this.cognitoService.logout();
    }
}