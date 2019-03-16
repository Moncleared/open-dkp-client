import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'root-layout',
    templateUrl: './root-layout.component.html'
})
export class RootLayoutComponent implements OnInit {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private clientService: ClientService) {
        this.clientService.clientDetails = this.route.snapshot.data['client'];
        console.log(this.clientService.clientDetails);
        if ( this.clientService.clientDetails instanceof HttpErrorResponse ) {
            this.router.navigate(['/clients']);
        }
    }

    ngOnInit(): void {}
}