import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [CommonModule, NxWelcomeComponent],
  selector: 'sl-SmartListMain-entry',
  template: `<sl-nx-welcome></sl-nx-welcome>`,
})
export class RemoteEntryComponent {}
