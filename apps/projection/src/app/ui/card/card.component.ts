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
import { Entity } from '../../model/card.model';
import { ListItemTemplateDirective } from '../../directive/list-item-template-directive';

@Component({
  selector: 'app-card',
  template: `<ng-content select="img"></ng-content>
    <section>
      <ng-container *ngFor="let item of list; trackBy: id">
        <ng-container
          [ngTemplateOutlet]="template"
          [ngTemplateOutletContext]="{ $implicit: item }"></ng-container>
      </ng-container>
    </section>

    <button
      (click)="add.emit()"
      class="border border-blue-500 bg-blue-300 p-2 rounded-sm">
      Add
    </button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, ListItemTemplateDirective, NgTemplateOutlet],
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
  @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
  template!: TemplateRef<any>;
  @Output() add = new EventEmitter();

  id(index: number, item: Entity) {
    return item.id;
  }
}
