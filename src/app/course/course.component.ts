import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';

interface CourseData {
  course: Course;
  lessons: Lesson[];
}
@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  data$: Observable<CourseData>;

  // course$: Observable<Course>;

  // lessons$: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute,
              private coursesService: CoursesService) {
    

  }

  ngOnInit() {
      const courseId = parseInt(this.route.snapshot.paramMap.get('courseId'));

      const course$ = this.coursesService.loadCourseById(courseId) 
        .pipe(
          startWith(null) // forces course observable to first emit null
        )

      const lessons$ = this.coursesService.loadAllCourseLessons(courseId)
        .pipe(
          startWith([]) // forces lessons observable to first emit an empty array
        )

      // combines two or more observables into one
      // returns tuples of data returned from multiple observables
      // has a slightly different logic for first value emmitted: waits for both to emit first value then it emits a combined first value
      this.data$ = combineLatest([course$, lessons$]) 
        .pipe(
          map(([course, lessons]) => {
            return {
              course, 
              lessons
            };
          }),
          tap(console.log) // logs all values emmitted from observable subscription
        )
  }


}



