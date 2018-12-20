import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoFiltro } from './../lancamento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LancamentoService } from '../lancamento.service';
import { LazyLoadEvent, MessageService, ConfirmationService } from 'primeng/components/common/api';
import { DataTable } from 'primeng/datatable';

@Component({
  selector: 'app-lancamento-pesquisa',
  templateUrl: './lancamento-pesquisa.component.html',
  styleUrls: ['./lancamento-pesquisa.component.css']
})
export class LancamentoPesquisaComponent implements OnInit {

  constructor(private lancService: LancamentoService, private messageService: MessageService,
    private confirmaService: ConfirmationService, private errorHandlerService: ErrorHandlerService,
    private authService: AuthService) { }

  @ViewChild('grid') public grid: DataTable;

  lancamentos = [];

  totalRegistros: number;

  ultpagina: boolean;

  public filtro = new LancamentoFiltro();

  pt_BR: any;

  loading = true;

  ngOnInit() {
    this.pt_BR = {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    };
 }

  listar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina;
    // Correção de bug para a grid acompanhar de fato a página obtida na pesquisa
    this.grid.first = pagina * this.filtro.itensPorPagina;
    this.lancService.listar(this.filtro)
      .subscribe((response) => {
        this.totalRegistros = response.totalElements;
        this.lancamentos = response.content;
        this.ultpagina = response.last;
        this.loading = false;
      }, (error: any) => {
        this.errorHandlerService.handle(error);
        this.loading = false;
      });
  }

  aoMudarTable(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.listar(pagina);
  }

  confirmaExclusao(lanc: any) {
      this.confirmaService.confirm({
        message: 'Confirma exclusão do Lançamento selecionado?',
        accept: () => {
          this.excluir(lanc);
        }
      });
  }

  excluir(lancamento: any) {
    this.loading = true;
    this.lancService.excluir(lancamento.id)
      .subscribe(() => {
        // atualiza a grid. caso seja a unico registro da ultima pagina, direciona para a pagina anterior
        if (this.ultpagina && this.lancamentos.length === 1) {
          this.listar(this.filtro.pagina - 1);
        } else {
          // atualiza a grid
          this.listar(this.filtro.pagina);
        }
        this.messageService.add({severity: 'success', summary: 'Algamoney', detail: 'Lançamento excluído com sucesso!',
         closable: false, life: 5000});
        this.loading = false;
      }, (error: any) => {
        this.errorHandlerService.handle(error);
        this.loading = false;
      });
  }



}
