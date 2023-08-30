import { Component } from '@angular/core';
import {
  FakeHttpService,
  randTeacher,
} from '../../data-access/fake-http.service';
import { TeacherStore } from '../../data-access/teacher.store';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
import { AsyncPipe } from '@angular/common';
import { ListItemTemplateDirective } from '../../directive/list-item-template-directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, catchError, of, tap } from 'rxjs';
import { Teacher } from '../../model/teacher.model';
@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card [list]="teachers$ | async" class="bg-light-red" (add)="addOne()">
      <img src="assets/img/teacher.png" width="200px" />
      <ng-template list-item-template let-teacher>
        <app-list-item
          [name]="teacher.firstname"
          (delete)="deleteOne(teacher.id)"></app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      .bg-light-red {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  standalone: true,
  imports: [
    CardComponent,
    ListItemComponent,
    AsyncPipe,
    ListItemTemplateDirective,
  ],
})
export class TeacherCardComponent {
  teachers$: Observable<Teacher[]> = this.store.teachers$;

  addOne() {
    this.store.addOne(randTeacher());
  }

  deleteOne(id: number) {
    this.store.deleteOne(id);
  }

  constructor(
    private readonly http: FakeHttpService,
    private readonly store: TeacherStore
  ) {
    this.http.fetchTeachers$
      .pipe(
        tap((teachers) => {
          this.store.addAll(teachers);
        }),
        catchError((error) => {
          console.log(error);
          return of(error);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
