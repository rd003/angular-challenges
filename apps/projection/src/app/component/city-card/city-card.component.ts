import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { CityStore } from '../../data-access/city.store';
import { CardComponent } from '../../ui/card/card.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListItemTemplateDirective } from '../../directive/list-item-template-directive';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  template: `<app-card
    class="bg-light-purple"
    [list]="cities$ | async"
    (add)="addOne()">
    <img src="assets/img/city.png" alt="student image" width="200px" />
    <ng-template list-item-template let-city>
      <app-list-item
        [name]="city.name"
        (delete)="deleteOne(city.id)"></app-list-item>
    </ng-template>
  </app-card>`,
  standalone: true,
  imports: [
    CardComponent,
    NgIf,
    AsyncPipe,
    ListItemTemplateDirective,
    ListItemComponent,
  ],
  styles: [
    `
      .bg-light-purple {
        background-color: rgb(188 0 255 / 10%);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent {
  cities$ = this.store.cities$;

  addOne() {
    this.store.addOne(randomCity());
  }

  deleteOne(id: number) {
    this.store.deleteOne(id);
  }

  constructor(
    private readonly http: FakeHttpService,
    private readonly store: CityStore
  ) {
    this.http.fetchCities$
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
