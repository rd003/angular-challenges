import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { PersonContext, PersonDirective } from './directives/person.directive';

interface Person {
  name: string;
  age: number;
}

@Component({
  standalone: true,
  imports: [NgTemplateOutlet],
  selector: 'person',
  template: `
    <ng-container
      *ngTemplateOutlet="
        personTemplateRef || emptyRef;
        context: { $implicit: person.name, age: person.age }
      "></ng-container>

    <ng-template #emptyRef> No Template </ng-template>
  `,
})
export class PersonComponent {
  @Input() person!: Person;

  @ContentChild(PersonDirective, { read: TemplateRef })
  personTemplateRef!: TemplateRef<PersonContext>;
}
