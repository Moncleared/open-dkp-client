import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientModel } from '../models/ClientModel';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    constructor(private http: HttpClient){}

    public clientDetails: ClientModel = null;

    getClient(subDomain): Observable<ClientModel> {
        return this.http.get<ClientModel>(`https://xxx.execute-api.us-east-2.amazonaws.com/beta/client/${subDomain}`);
    }
    getAllClients(): Observable<ClientModel[]> {
        return this.http.get<ClientModel[]>(`https://xxx.execute-api.us-east-2.amazonaws.com/beta/client`);
    }
}