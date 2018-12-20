import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  blockedDocument = false;

  frmLogin = this.fb.group({
    nome: [null, Validators.required],
    senha: [null, Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService,
     private errorHandler: ErrorHandlerService, private router: Router) { }

  ngOnInit() {

  }

  fazerLogin() {
    this.blockedDocument = true;
    this.authService.login(this.frmLogin.get('nome').value, this.frmLogin.get('senha').value)
    .subscribe((response) => {
      this.authService.armazenarToken(response.access_token);
      this.blockedDocument = false;
      this.errorHandler.getMessageService().clear();
      this.router.navigate(['/lancamentos']);
    }, (error) => {
       this.errorHandler.handle(error);
       this.blockedDocument = false;
    });
  }

}
