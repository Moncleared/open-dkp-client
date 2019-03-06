import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class LoadingDataService {
    private isLoading: BehaviorSubject < boolean > ;

    constructor() {
        this.isLoading = new BehaviorSubject < boolean > (false);
    }

    public getIsLoading(): Observable < boolean > {
        return this.isLoading.asObservable();
    }

    public setLoadingStatus(newValue: boolean): void {
        this.isLoading.next(newValue);
    }

}