import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        LoadingService, // create a new separate instance of LoadingService that can then be injected inside this component
        MessagesService
    ]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private coursesStore: CoursesStore,
        private messagesService: MessagesService) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    save() {
        
      const changes = this.form.value;

      this.coursesStore.saveCourse(this.course.id, changes)
        // Below commented out since error message rendering is useless if dialog is already closed before the message comes along.
        // .pipe(
        //     catchError((err) => {
        //         const message = "Could not save course.";
        //         console.log(message, err);
        //         this.messagesService.showErrors(message);
        //         return throwError(err); //replace parent observable
        //     })
        // )
        .subscribe();

      this.dialogRef.close(changes); // closing dialog while save is ongoing in the background via a network call.
      
      // Below subscribes to saveCourse$ observable and returns val from saveCourse$
    //   this.loadingService.showLoaderUntilCompleted(saveCourse$) 
    //     .subscribe(
    //         (val) => {
    //             this.dialogRef.close(val);
    //         }
    //     );

    }

    close() {
        this.dialogRef.close();
    }

}
