import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
import { AsyncPipe } from '@angular/common';
import { ListItemTemplateDirective } from '../../directive/list-item-template-directive';

@Component({
  selector: 'app-student-card',
  template: `<app-card
    [list]="students$ | async"
    (add)="add()"
    class="bg-light-green">
    <img src="assets/img/student.webp" width="200px" />

    <ng-template
      list-item-template
      let-student
      [name]="student.firstname"
      (delete)="delete(student.id)">
    </ng-template>
  </app-card>`,
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
export class StudentCardComponent implements OnInit {
  students$ = this.store.students$;
  constructor(private http: FakeHttpService, private store: StudentStore) {}

  add() {
    this.store.addOne(randStudent());
  }

  delete(id: number) {
    this.store.deleteOne(id);
  }

  ngOnInit(): void {
    this.http.fetchStudents$.subscribe((s) => this.store.addAll(s));
  }
}
