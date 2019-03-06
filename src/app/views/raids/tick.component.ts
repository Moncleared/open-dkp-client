import { Component, Input, OnInit } from '@angular/core';
import { TickModel } from '../../models/TickModel';

@Component({
    templateUrl: 'tick.component.html',
    selector: 'tick-component'
})

export class TickComponent implements OnInit {
    @Input() tickModel: TickModel;
    singleAttendee: string;
    dump: any;
    file: any;

    constructor() {}

    ngOnInit() {
        this.singleAttendee = '';
        if (!this.tickModel.Attendees) {
            this.tickModel.Attendees = new Set < string > ();
        } else {
            //var vSortedArray = Array.from(this.tickModel.Attendees).sort();
            //this.tickModel.Attendees = new Set < string > (vSortedArray);
            this.sortAttendees();
        }
    }

    removeAttendee(attendee) {
        this.tickModel.Attendees.delete(attendee);
    }

    addSingleAttendee() {
        this.singleAttendee = this.singleAttendee.trim();
        if (this.singleAttendee && this.singleAttendee.split(' ').length <= 1) {
            this.tickModel.Attendees.add(this.singleAttendee);
            this.sortAttendees();
        }
    }

    clearDump() {
        this.dump = '';
    }

    processDump() {
        this.dump = this.dump.trim();
        let vEntries = this.dump.split('\n');
        vEntries.forEach(x => {
            let vTokens = x.split('\t');
            //If the first token is an integer, we're processing a Raid Dump, otherwise assume guild dump
            //Raid Dumps, 2nd token is Character Name (all we need)
            //Guild Dumps, 1st token is Character Name (all we need)
            if (parseInt(vTokens[0]) >= 0) {
                this.safeAdd(vTokens[1].trim());
            } else {
                this.safeAdd(vTokens[0].trim());
            }
        });
        this.sortAttendees();
    }

    safeAdd(player) {
        player = player.trim();
        if (player.length > 2) {
            this.tickModel.Attendees.add(player);
        }
    }

    fileChanged(e) {
        this.file = e.target.files[0];
        this.uploadDocument();
    }

    uploadDocument() {
        let vFileReader = new FileReader();
        vFileReader.onload = (e) => {
            this.dump = vFileReader.result;
        }
        vFileReader.readAsText(this.file);
    }

    sortAttendees() {
        var vSortedArray = Array.from(this.tickModel.Attendees).sort();
        this.tickModel.Attendees = new Set < string > (vSortedArray);
    }
}