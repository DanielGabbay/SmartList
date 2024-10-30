import {ChangeDetectionStrategy, Component, inject, WritableSignal, signal, computed} from '@angular/core';
import {AuthService, IAuthResponse} from "@core";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'sl-login',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService: AuthService = inject(AuthService);
  protected readonly loginResponse: WritableSignal<IAuthResponse> = signal<IAuthResponse>(null);
  protected readonly formattedJsonResponse = computed(() => this.loginResponse() ? prettyJSON(this.loginResponse())?.trim() : '');

  constructor() {
  }

  protected login() {
    this.authService.login('admin', 'Admin123!').subscribe(res => {
      console.log(res);
      this.loginResponse.set(res);
    })
  }
}


function prettyJSON(obj: object): string {
  const jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
  const replacer = function (match, pIndent, pKey, pVal, pEnd) {
    const key = '<span class="json-key" style="color: brown">',
      val = '<span class="json-value" style="color: navy">'
    const str = '<span class="json-string" style="color: olive">';
    let r = pIndent || '';
    if (pKey)
      r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
    if (pVal)
      r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
    return r + (pEnd || '');
  }
  return JSON.stringify(obj, null, 3)
    .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(jsonLine, replacer);
}
