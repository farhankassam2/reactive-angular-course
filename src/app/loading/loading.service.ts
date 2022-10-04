import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, tap, finalize } from 'rxjs/operators';



@Injectable()
export class LoadingService {
    // Only the LoadingService should have ability to emit values --> hence private
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    // Observable allows subscribing but not emitting --> subscribing is public hence no private
    loading$: Observable<boolean> = this.loadingSubject.asObservable(); // true if want to show loading indicator, otherwise false

    constructor() {
        console.log("New LoadingService created...");
    }
    // T is for type safety and allows any type but all Ts to use the same type only
    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> { //the returned value will be able to turn on and off the loading indicator
        return of(null) // sending an initial value that creates an Observable returning value in brackets
            .pipe(
                tap(() => this.loadingOn()), // this side effect is triggered
                concatMap(() => obs$), // transfers emitted values from source to new observable
                finalize(() => this.loadingOff()) // when input observable stops emitting values, we finalize observable chain
            );

            // Completely linked to lifecycle of the output returned observable.
    }

    loadingOn() {
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);
    }
}