import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
import { AsyncPipe } from '@angular/common';
import { ListItemTemplateDirective } from '../../directive/list-item-template-directive';
import { Student } from '../../model/student.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      class="bg-light-green"
      [list]="students$ | async"
      (add)="addOne()">
      <img src="assets/img/student.webp" alt="student image" width="200px" />
      <ng-template list-item-template let-student>
        <app-list-item
          [name]="student.firstname"
          (delete)="deleteOne(student.id)"></app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      .bg-light-green {
        background-color: rgba(0, 250, 0, 0.1);
      }
    `,
  ],
  imports: [
    CardComponent,
    ListItemComponent,
    AsyncPipe,
    ListItemTemplateDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent {
  students$: Observable<Student[]> = this.store.students$;

  addOne() {
    this.store.addOne(randStudent());
  }

  deleteOne(id: number) {
    this.store.deleteOne(id);
  }

  constructor(
    private readonly http: FakeHttpService,
    private readonly store: StudentStore
  ) {
    this.http.fetchStudents$
      .pipe(
        tap((students) => {
          this.store.addAll(students);
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
