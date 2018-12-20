import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, throwError as observableThrowError} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API: string;
  private APILogout: string;

  jwtPayload: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.API = `${environment.apiEndpoint}/oauth/token`;
    this.APILogout = `${environment.apiEndpoint}/tokens/invalidate`;
    this.carregarPayload();
  }

  public getToken() {
    return this.jwtHelper.tokenGetter;
  }

  public login(user: string, senha: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic YW5ndWxhcjpAbmd1bEBy'
      }),
      withCredentials: true
    };

    const body = `username=${user}&password=${senha}&grant_type=password`;

    return this.http.post<any>(`${this.API}`, body, httpOptions)
    .pipe(catchError((respError) => {
      if (respError.status === 400) {
        if (respError.error.error === 'invalid_grant') {
          return observableThrowError('Usuário ou Senha inválidos');
        }
      }
      return observableThrowError(respError);
    }));
  }

  public isAcessTokenNulo(): boolean {
    const token = localStorage.getItem('token');
    return !token;
  }

  public isAcessTokenInvalido() {

    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  public obterNovoAcessToken(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic YW5ndWxhcjpAbmd1bEBy'
      }),
        withCredentials: true
    };

     const body = 'grant_type=refresh_token';

     return this.http.post<any>(`${this.API}`, body, httpOptions)
     .pipe(catchError((respError) => {
          return observableThrowError(respError);
       })
     );
  }

  public armazenarToken(token: string) {
    localStorage.setItem('token', token);
    this.jwtPayload = this.jwtHelper.decodeToken(token);
  }

  public carregarPayload() {
    if (localStorage.getItem('token')) {
      this.jwtPayload = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    }
  }

  public fazerLogout(): Observable<any> {
    return this.http.delete<any>(`${this.APILogout}`, {withCredentials: true});
  }

  public invalidateSession(): void {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  public temPermissao(permissao: string): boolean {
     return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  public temQualquerPermissao(roles: Array<string>): boolean {
    for (const role of roles) {
       if (this.temPermissao(role)) {
         return true;
       }
    }
  return false;
  }
}
