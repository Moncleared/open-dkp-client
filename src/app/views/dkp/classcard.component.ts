import { Component, Input, OnInit } from '@angular/core';

@Component({
    templateUrl: 'classcard.component.html',
    selector: 'classcard'
})
export class ClassCardComponent implements OnInit {
    constructor() {}

    @Input() inputModel: any;

    ngOnInit(): void {
        
    }
}