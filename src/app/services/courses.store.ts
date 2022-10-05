import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
    providedIn: 'root'
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]); // BehaviourSubject has reference to current list of courses somewhere

    courses$: Observable<Course[]> = this.subject.asObservable(); // anywhere can subscribe to this observable without knowing where it is coming from. But they know that it contains the latest courses list.

    constructor(private http: HttpClient, 
                private loading: LoadingService, 
                private messagesService: MessagesService) {
        this.loadAllCourses(); // all courses loaded once at application startup.
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "Could not load courses";
                    this.messagesService.showErrors(message);
                    console.log(message, err);
                    return throwError(err); // terminates observable chain
                }),
                tap(courses => this.subject.next(courses))
            );
        
        this.loading.showLoaderUntilCompleted(loadCourses$)
            .subscribe(); // loading indicator when we subscribe to output observable and loading finishes when observable finishes its lifecycle.
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        // UPDATE CLIENT:
        const courses: Course[] = this.subject.getValue(); // list of courses last emitted by subject
        const index = courses.findIndex(course => course.id === courseId);
        const newCourse: Course = {
                ...courses[index],
                ...changes
        };
        const newCourses: Course[] = courses.slice(0); // creates complete copy of courses
        newCourses[index] = newCourse;

        this.subject.next(newCourses); // user interface then will immediately reflect changes

        // SAVE TO SERVER: without loading indicator in UI.
        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                catchError(err => {
                    const message = "Could not save course";
                    console.log(message, err);
                    this.messagesService.showErrors(message);
                    return throwError(err);
                }),
                shareReplay() // so that multiple subscriptions to saveCourse() does not trigger multiple API calls
            )
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