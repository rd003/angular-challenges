import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { CityStore } from '../../data-access/city.store';
import { CardComponent } from '../../ui/card/card.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { Subject, takeUntil, tap } from 'rxjs';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card
      [list]="cities$ | async"
      (add)="addCity()"
      class="bg-light-purple">
      <img src="/assets/img/city.png" width="200px" />

      <ng-template list-item-template let-city>
        <app-list-item [name]="city.name" (delete)="deleteCity(city.id)" />
      </ng-template>
    </app-card>
  `,
  standalone: true,
  imports: [CardComponent, NgIf, AsyncPipe, ListItemComponent],
  styles: [
    `
      .bg-light-purple {
        background-color: rgb(188 0 255 / 10%);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent implements OnInit, OnDestroy {
  cities$ = this.store.cities$;
  destroy$ = new Subject<boolean>();

  addCity() {
    this.store.addOne(randomCity());
  }

  deleteCity(id: number) {
    this.store.deleteOne(id);
  }

  ngOnInit(): void {
    this.http.fetchCities$
      .pipe(
        tap((cities) => this.store.addAll(cities)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  constructor(
    private readonly http: FakeHttpService,
    private readonly store: CityStore
  ) {}
}
