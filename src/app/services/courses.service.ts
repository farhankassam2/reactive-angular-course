import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

@Injectable({
    providedIn: 'root' // one instance of the service for the whole application
})
export class CoursesService {
    constructor(private http: HttpClient) {}

    loadAllCourses(): Observable<Course[]> {
        // map rxjs combines different observables quickly to parse data and returns a new derived observable
        return this.http.get<Course[]>("/api/courses")
            .pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> { // Partial: type safety and can define only some items in Course
        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                shareReplay() // prevents triggering multiple http calls if it gets subscribed to multiple times
            );
    }

    searchLessons(search: string): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                filter: search,
                pageSize: "100"
            }
        }).
            pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }
}