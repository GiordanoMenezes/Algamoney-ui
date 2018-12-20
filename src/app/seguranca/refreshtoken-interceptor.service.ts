import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { flatMap, catchError } from 'rxjs/operators';
import { Observable, throwError as observableThrowError, EMPTY } from 'rxjs';
import { ErrorHandlerService, NotAuthenticatedError } from '../core/error-handler.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RefreshtokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('/oauth/token') > -1 && req.method === 'POST') {
      return next.handle(req);
    }
    const authService = this.injector.get(AuthService);
    // checa se o token está expirado
    if (authService.isAcessTokenInvalido()) {
      console.log('requisição com acess token inválido. Requisitando novo token......');
      // requisita novo token
      return authService.obterNovoAcessToken().pipe(flatMap((data) => {
        const novotoken = data.access_token;
        localStorage.setItem('token', novotoken);
        if (authService.isAcessTokenInvalido()) {
          console.log('Novo access token não é válido.');
          throw new NotAuthenticatedError();
        }
        return next.handle(req.clone({
          setHeaders: { Authorization: `Bearer ${novotoken}` }
        }));
        // caso dê erro ao obter novo acess token, devemos forçar o relogin do usuario e
        // tambem chamar o errorHandler que mostrará a mensagem de sessão expirada caso o erro
        // tenha acontecido devido ao refresh token expirado
      })).pipe(catchError((error: HttpErrorResponse) => {
        const errorHandler = this.injector.get(ErrorHandlerService);
        const router = this.injector.get(Router);
        authService.invalidateSession();
        errorHandler.handle(error);
        router.navigate(['/login']);
        return EMPTY;
      }));
    } else {
      // se o accesstoken for válido, apenas tentamos repassar a requisição
      return next.handle(req)
        // pode acontecer de o token ainda está valido no teste da linha 22, mas no exato momento do interceptor passar a requisiçào,
        // o token expira, e então temos q capturar o erro e pedir um novo token.
        .pipe(catchError((respError: HttpErrorResponse) => {
          if (respError.status === 401 && respError.error.error_description.startsWith('Access token expired')) {
            // requisição com acess token inválido. Requisitando novo token......
            return authService.obterNovoAcessToken().pipe(flatMap((data) => {
              const novotoken = data.access_token;
              localStorage.setItem('token', novotoken);
              if (authService.isAcessTokenInvalido()) {
                console.log('Novo access token não é válido.');
                throw new NotAuthenticatedError();
              }
              return next.handle(req.clone({
                setHeaders: { Authorization: `Bearer ${novotoken}` }
              }));
              // caso dê erro ao obter novo acess token, devemos forçar o relogin do usuario e
              // tambem chamar o errorHandler que mostrará a mensagem de sessão expirada caso o erro
              // tenha acontecido devido ao refresh token expirado
            })).pipe(catchError((error: HttpErrorResponse) => {
              const errorHandler = this.injector.get(ErrorHandlerService);
              const router = this.injector.get(Router);
              authService.invalidateSession();
              errorHandler.handle(error);
              router.navigate(['/login']);
              return EMPTY;
            }));
          }
          // se for outro erro que não token expirado, apenas repassamos o erro pra frente
          // (lançamos como se nem tivessemos feito o catchError)
          return observableThrowError(respError);
        })
        );
    }
  }
}
