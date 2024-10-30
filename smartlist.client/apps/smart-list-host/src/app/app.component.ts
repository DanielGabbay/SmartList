import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  standalone: true,
  imports: [ RouterModule],
  selector: 'sl-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SmartListHost';
}
