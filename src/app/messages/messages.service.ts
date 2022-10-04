import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";


@Injectable()
export class MessagesService {

    private subject = new BehaviorSubject<string[]>([]); // can emit new values

    errors$: Observable<string[]> = this.subject.asObservable()
        .pipe (
            filter(messages => messages && messages.length > 0)
        ); // new observable that emits the same values as subject if length > 0

    showErrors(...errors: string[]) {
        this.subject.next(errors); // emits errors received by function
    }
}