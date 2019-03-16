import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientModel } from '../models/ClientModel';
import { Observable } from 'rxjs';
import { rxSubscriber } from 'rxjs/internal-compatibility';

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    constructor(private http: HttpClient){}

    public clientDetails: ClientModel = null;

    getClient(subDomain): Observable<ClientModel> {
        //Uncomment below line when you setup your client in db and ready to test against it
        //return this.http.get<ClientModel>(`https://xxx.execute-api.us-east-2.amazonaws.com/beta/client/${subDomain}`);
        return this.mockClient();
    }
    getAllClients(): Observable<ClientModel[]> {
        //return this.http.get<ClientModel[]>(`https://xxx.execute-api.us-east-2.amazonaws.com/beta/client`);
        return this.mockClients();
    }

    mockClients(): Observable<ClientModel[]> {
        return Observable.create( observer => {
            this.mockClient().subscribe( client => {
                var vArray = [];
                vArray.push(client);
                observer.next(vArray);
            })
        });        
    }
    mockClient(): Observable<ClientModel> {
        var vClientModel: ClientModel = new ClientModel();
        vClientModel.ClientId = "99IK2BLeIEWdV6bF9jFmcQ==";
        vClientModel.Name = "Localhost Demo";
        vClientModel.Subdomain = "demo";
        vClientModel.Identity = "us-east-2:eadb272f-1ede-4a83-aaaf-ae0e3c939e04";
        vClientModel.UserPool = "us-east-2_cxrAWVUPr";
        vClientModel.WebClientId = "2lrbi6dmu8j1ob4heajnkbi9ml";
        vClientModel.Website = "http://localhost:4200";

        return Observable.create( observer => {
            observer.next(vClientModel);
        });
    }
}