import { PessoasRoutingModule } from './pessoas-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import {BlockUIModule} from 'primeng/blockui';
import { PessoaPesquisaComponent } from './pessoa-pesquisa/pessoa-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PessoasRoutingModule,

    InputTextModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    TooltipModule,
    BlockUIModule
  ],
  declarations: [
    PessoaCadastroComponent,
    PessoaPesquisaComponent,
  ],
   exports: [
  ]
})
export class PessoasModule { }
