import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from "lodash";
import { DKPInfoModel } from '../../models/DKPInfoModel';

@Component({
    templateUrl: 'dkpinfomodal.component.html'
})
export class DkpInfoModalComponent implements OnInit {
    @Input() inputModel: DKPInfoModel;

    constructor(public bsModalRef: BsModalRef) {
    }
    
    ngOnInit() {
    }
}