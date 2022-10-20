import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { User } from "../model/user";

const AUTH_DATA = "auth_data"; // local storage key under which we save user profile.

@Injectable({
    providedIn: 'root'
})
export class AuthStore {

    private subject = new BehaviorSubject<User>(null);

    user$: Observable<User> = this.subject.asObservable(); // user will emit same values as subject
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;

    constructor(private http: HttpClient) {
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));
        
        const user = localStorage.getItem(AUTH_DATA);
        if (user) { 
            this.subject.next(JSON.parse(user));
        }
    }

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>("/api/login", {email, password}).pipe(
            tap(user => {
                this.subject.next(user);
                localStorage.setItem(AUTH_DATA, JSON.stringify(user)); // local key-value pair only allowed
            }),
            shareReplay()
        );
    }

    logout() {
        this.subject.next(null);
        localStorage.removeItem(AUTH_DATA);
    }
}