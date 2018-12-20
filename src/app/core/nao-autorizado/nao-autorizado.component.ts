import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  template: `
  <div class="container" style="margin-top:20px ; margin-left: 15px;">
    <h1 class="text-center">Acesso Negado!</h1>
    <h3 style="color: #ea465b">Você não tem Permissão para acessar essa página</h3>
  </div>
  <button pButton label="Voltar" class="btn btn-primary" icon="fa fa-undo" style="margin-top:20px;margin-left:15px;"
   (click)="voltarPagina()"></button>
  `
})
export class NaoAutorizadoComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  voltarPagina() {
    this.location.back();
  }

}
