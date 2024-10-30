import {Injectable, inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IAuthResponse} from "../types";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {
  }

  // admin
  // Admin123!
  login(username: string, password: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>('/api/auth/login', null, {params: {username, password}});
  }
}
