import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sl-nx-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    Welcome to SmartList Main Application!
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
