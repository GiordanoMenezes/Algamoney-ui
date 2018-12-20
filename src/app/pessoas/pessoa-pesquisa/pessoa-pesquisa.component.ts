import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoaService, PessoaFiltro } from '../pessoa.service';
import { LazyLoadEvent, MessageService, ConfirmationService } from 'primeng/components/common/api';
import { DataTable } from 'primeng/datatable';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-pessoa-pesquisa',
  templateUrl: './pessoa-pesquisa.component.html',
  styleUrls: ['./pessoa-pesquisa.component.css']
})
export class PessoaPesquisaComponent implements OnInit {

  constructor(private pessoaService: PessoaService, private messageService: MessageService,
    private confirmaService: ConfirmationService, private errorService: ErrorHandlerService,
    private authService: AuthService) { }

  @ViewChild('grid') public grid: DataTable;

  pessoas = [];

  filtro = new PessoaFiltro();

  totalRegistros: number;

  ultpagina: number;

  loading = true;


  ngOnInit() {
  }

  listar(pagina = 0) {
    this.loading = true;
    this.filtro.pagina = pagina;
    // Correção de bug para a grid acompanhar de fato a página obtida na pesquisa
    this.grid.first = pagina * this.filtro.itensPorPagina;
    this.pessoaService.listar(this.filtro)
      .subscribe((response) => {
        this.pessoas = response.content;
        this.totalRegistros = response.totalElements;
        this.ultpagina = response.last;
        this.loading = false;
      }, (error: any) => {
        this.errorService.handle(error);
        this.loading = false;
      });
  }

  aoMudarTable(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.listar(pagina);
  }

  confirmaExclusao(pessoa: any) {
    this.confirmaService.confirm({
      message: `Confirma exclusão de ${pessoa.nome}?`,
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.loading = true;
    this.pessoaService.excluir(pessoa.codigo)
      .subscribe(() => {
        // atualiza a grid. caso seja a unico registro da ultima pagina, direciona para a pagina anterior
        if (this.ultpagina && this.pessoas.length === 1) {
          this.listar(this.filtro.pagina - 1);
        } else {
          // atualiza a grid
          this.listar(this.filtro.pagina);
        }
        this.messageService.add({
          severity: 'success', summary: 'Algamoney', detail: `Pessoa ${pessoa.nome} excluída com sucesso!`,
          closable: false, life: 5000
        });
        this.loading = false;
      }, (error: any) => {
        this.errorService.handle(error);
        this.loading = false;
      });
  }

  alterarStatus(pessoa: any): void {
    this.loading = true;
    const novostatus = !pessoa.ativo;
    const msg = novostatus ? ' ativada' : ' inativada';
    this.pessoaService.alterarStatus(pessoa.codigo, novostatus)
      .subscribe(() => {
        this.messageService.clear();
        this.messageService.add({
          severity: 'success', summary: 'Algamoney', detail: `Pessoa ${pessoa.nome} ${msg} com sucesso!`,
          closable: false, life: 5000
        });
        pessoa.ativo = novostatus;
        this.loading = false;
      }, (error: any) => {
        this.messageService.clear();
        this.errorService.handle(error);
        this.loading = false;
      });
  }

}
