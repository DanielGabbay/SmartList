import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PrimeNGConfig} from "primeng/api";
import {Aura} from "primeng/themes/aura";

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'sl-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SmartListHost';

  constructor(private config: PrimeNGConfig) {
    this.config.theme.set({preset: Aura});
  }
}
