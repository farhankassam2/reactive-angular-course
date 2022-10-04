import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>; // data variables are Observables subscribed to by async pipe in the template

  advancedCourses$: Observable<Course[]>;


  constructor(
              private loadingService: LoadingService,
              private messagesService: MessagesService,
              private coursesStore: CoursesStore) {}

  ngOnInit() { // to be called by Angular framework only and not by application code
      this.reloadCourses();
    
    // this.http.get('/api/courses')
    //   .subscribe(
    //     res => {

    //       const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);

    //       this.beginnerCourses = courses.filter(course => course.category == "BEGINNER");

    //       this.advancedCourses = courses.filter(course => course.category == "ADVANCED");

    //     });

  }

  reloadCourses() {
    // Below commented out when adding state management in CoursesStore:
    // // this.loadingService.loadingOn();
    //   const courses$ = this.coursesService.loadAllCourses()
    //   .pipe(
    //     map(courses => courses.sort(sortCoursesBySeqNo)),
    //     catchError((err) => {
    //       const message = "Could not load courses";
    //       this.messagesService.showErrors(message);
    //       console.log(message, err);
    //       return throwError(err); // terminates observable chain
    //     })
    //     // finalize(() => this.loadingService.loadingOff())
    //   );

    //   // Less decoupled and less verbose below: line 54
    //   const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    // this.beginnerCourses$ = loadCourses$.pipe (
    //   map(courses => courses.filter(course => course.category === "BEGINNER"))
    // );

    // this.advancedCourses$ = loadCourses$.pipe (
    //   map(courses => courses.filter(course => course.category === "ADVANCED" || course.category === "INTERMEDIATE"))
    // );

    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");

    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");
  }

}




