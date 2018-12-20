import { NaoAutorizadoComponent } from './core/nao-autorizado/nao-autorizado.component';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';

const approutes: Routes = [
    {path: '', redirectTo: 'lancamentos', pathMatch: 'full'},
    { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
    {path: 'nao-autorizado', component: NaoAutorizadoComponent},
    {path: '**', redirectTo: 'pagina-nao-encontrada'}
 ];

@NgModule({
  imports: [RouterModule.forRoot(approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
