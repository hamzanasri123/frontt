import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/users.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly API: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private translate: TranslateService) { }

  readonly ID_TOKEN = 'acessToken';

  public authenticate(email: string, password: string) {
    return this.httpClient.post<any>(this.API + "/auth/signin", { email, password })
      .pipe(tap(res => this.setSession(res.data)));
  }

  public signUp(user: any) {
    return this.httpClient.post<any>(this.API + "/auth/signup", user)
  }

  verifyActivationToken(token: string) {
    return this.httpClient.get<any>(this.API + "/auth/activate/" + token)
  }

  public resetPasswordRequest(email: string) {
    return this.httpClient.post<any>(this.API + "/auth/password-reset-request", { email });
  }
  public resetPassword(password: string, passwordToken: string) {
    return this.httpClient.post<any>(this.API + "/auth/reset-password", { password, passwordToken });
  }

  updateUser(user: User) {
    return this.httpClient.put<any>(`${this.API}/auth/user/${user._id}`, user)
      .pipe(tap(res => this.setSession(res.data)));
  }

  private setSession(authResponse) {
    const token = authResponse.token;
    localStorage.setItem(this.ID_TOKEN, token);
    let user: User = new JwtHelperService().decodeToken(token);
    localStorage.setItem('nom', user.nom);
    localStorage.setItem('profilePicture', user.profilePicture);
    localStorage.setItem('language', user.language);
    this.translate.use(user.language);
  }

  public logout() {
    localStorage.clear();
  }

  public isAuthenticated() {
    try {
      const token = localStorage.getItem(this.ID_TOKEN);
      return token ? !(new JwtHelperService().isTokenExpired(token)) : false;
    }
    catch (e) {
      localStorage.clear();
      return false;
    }
  }

  public getCurrentUser() {
    const token = localStorage.getItem(this.ID_TOKEN);
    let user: User = new JwtHelperService().decodeToken(token);
    return user;
  }


  public isAdmin() {
    if (!this.isAuthenticated()) return false;
    let token = localStorage.getItem(this.ID_TOKEN);
    let role = new JwtHelperService().decodeToken(token)['role'] as string;
    return role === "admin"
  }

  public verifyRestPasswordToken(passwordToken: string) {
    return this.httpClient.get<any>(this.API + "/auth/verify-password-token/" + passwordToken);
  }

  updatePassword(oldPassword: string, newPassword: string) {
    return this.httpClient.put<any>(this.API + "/auth/password", { oldPassword, newPassword });
  }

}
