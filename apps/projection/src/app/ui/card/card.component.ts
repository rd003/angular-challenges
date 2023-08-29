import { NgFor, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { ListItemTemplateDirective } from '../../directive/list-item-template-directive';
import { Entity } from '../../model/card.model';

@Component({
  selector: 'app-card',
  template: `<ng-content select="img"></ng-content>
    <section>
      <ng-container *ngFor="let item of list; trackBy: id">
        <ng-template
          [ngTemplateOutlet]="listItemTemplate"
          [ngTemplateOutletContext]="{ $implicit: item }"></ng-template>
      </ng-container>
    </section>

    <button
      class="border border-blue-500 bg-blue-300 p-2 rounded-sm"
      (click)="addNewItem()">
      Add
    </button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgTemplateOutlet],
  styles: [
    `
      :host {
        @apply border-2 border-black rounded-md p-4 w-fit flex flex-col gap-3;
      }
    `,
  ],
})
export class CardComponent {
  @Input() list: Entity[] | null = null;
  @Input() customClass = '';

  @Output() add = new EventEmitter<void>();

  @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
  listItemTemplate!: TemplateRef<any>;

  addNewItem() {
    this.add.emit();
  }

  id(index: number, item: Entity) {
    return item.id;
  }
}
