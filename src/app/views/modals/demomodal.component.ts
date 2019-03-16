import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from "lodash";

@Component({
    templateUrl: 'demomodal.component.html'
})
export class DemoModalComponent implements OnInit {
    constructor(public bsModalRef: BsModalRef) {
    }
    
    ngOnInit() {
    }
}