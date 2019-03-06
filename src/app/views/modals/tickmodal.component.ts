import { Component, Input, OnInit } from '@angular/core';
import { TickModel } from '../../models/TickModel';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as _ from "lodash";

@Component({
    templateUrl: 'tickmodal.component.html',
    selector: 'tickmodal'
})
export class TickModalComponent implements OnInit {
    @Input() tickModel: TickModel;
    modifiedTickModel: TickModel;

    constructor(public bsModalRef: BsModalRef) {

    }

    ngOnInit() {
        this.modifiedTickModel = _.cloneDeep(this.tickModel);
    }

    saveTick() {
        this.tickModel.Description = this.modifiedTickModel.Description;
        this.tickModel.Value = this.modifiedTickModel.Value;
        this.tickModel.Attendees = this.modifiedTickModel.Attendees;
        this.bsModalRef.hide();
    }
}