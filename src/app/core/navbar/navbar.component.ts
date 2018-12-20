import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../error-handler.service';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  mostrarMenu: any;

  constructor(private router: Router, public authService: AuthService,
     private errorHandlerService: ErrorHandlerService) { }

  ngOnInit() {
  }

  exibindoMenu() {
    return this.router.url !== '/login';
  }

  public logout() {
    this.authService.fazerLogout()
    .subscribe((data) => {
       this.authService.invalidateSession();
       this.router.navigate(['/login']);
    }, (error) => {
       console.log('Erro ao efetuar Logout', error);
       this.errorHandlerService.handle(error);
    });
  }

  // renovarToken() {
  //   return this.authService.obterNovoAcessToken()
  //   .subscribe((response) => {
  //     this.authService.armazenarToken(response.access_token);
  //     console.log('Novo acess token criado!!');
  //   })
  // }

}
