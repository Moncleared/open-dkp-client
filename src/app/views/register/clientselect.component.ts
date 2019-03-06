import { Component, OnInit } from '@angular/core';
import { ClientModel } from '../../models/ClientModel';
import { ClientService } from '../../services/client.service';

@Component({
    selector: 'clientselect-dashboard',
    templateUrl: 'clientselect.component.html'
})
export class ClientSelectComponent implements OnInit {

    constructor(private clientService: ClientService) {
    }

    ngOnInit() {
        this.clientService.getAllClients().subscribe(results => {
            console.log(results);
            this.clients = results;
            if ( results.length > 0 ) this.clientModel = results[0];
        },
        error => {
            console.log(error);
        });
    }

    compareFn(c1: ClientModel, c2: ClientModel): boolean {
        return c1 && c2 ? c1.ClientId === c2.ClientId : c1 === c2;
    }

    redirectToClient() {
        window.open(`https://${this.clientModel.Subdomain}.opendkp.com`, '_self');
    }

    //Variable Declarations
    public clients: ClientModel[] = [];
    public clientModel: ClientModel;
}