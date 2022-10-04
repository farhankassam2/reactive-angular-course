import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
    providedIn: 'root'
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable(); // anywhere can subscribe to this observable without knowing where it is coming from. But they know that it contains the latest courses list.

    constructor(private http: HttpClient, 
                private loading: LoadingService, 
                private messages: MessagesService) {
        this.loadAllCourses(); // all courses loaded once at application startup.
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "Could not load courses";
                    this.messages.showErrors(message);
                    console.log(message, err);
                    return throwError(err); // terminates observable chain
                }),
                tap(courses => this.subject.next(courses))
            );
        
        this.loading.showLoaderUntilCompleted(loadCourses$)
            .subscribe(); // loading indicator when we subscribe to output observable and loading finishes when observable finishes its lifecycle.
    }
    
    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses => 
                        courses.filter(course => course.category === category)
                                .sort(sortCoursesBySeqNo))
            );
    }
}