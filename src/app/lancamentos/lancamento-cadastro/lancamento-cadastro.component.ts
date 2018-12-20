import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { CategoriaService } from 'src/app/categorias/categoria.service';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { MessageService } from 'primeng/components/common/api';
import { LancamentoService } from '../lancamento.service';
import * as moment from 'moment';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  lancpadrao = 'DESPESA';

  titulobanner = '';

  blockedDocument = false;

  tipolancs = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' }
  ];

  categorias = [{ label: 'Selecione Categoria', value: null }];
  pessoas = [{ label: 'Selecione Pessoa', value: null }];

  frmLancamento = this.fb.group({
    codigo: [null],
    descricao: [null, [Validators.required, Validators.minLength(5)]],
    dataVencimento: [null, Validators.required],
    dataPagamento: [null],
    valor: [null, [Validators.required, Validators.min(0)]],
    observacao: [null],
    tipo: ['RECEITA', Validators.required],
    categoria: this.fb.group({
      codigo: [null, Validators.required],
      nome: []
    }),
    pessoa: this.fb.group({
      codigo: [null, Validators.required],
      nome: []
    })
  });

  pt_BR: any;

  constructor(private actroute: ActivatedRoute, private router: Router, private categoriaService: CategoriaService,
    private pessoaService: PessoaService, private lancamentoService: LancamentoService,
    private errorHandlerService: ErrorHandlerService, private messageService: MessageService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.blockedDocument = true;
    this.pt_BR = {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    };
    this.carregarCategorias();
    this.carregarPessoas();
    const par = this.actroute.snapshot.params['id'];
    if (par) {
      this.lancamentoService.buscaPorId(par)
        .subscribe((data) => {
        this.converterDatas(data);
        this.frmLancamento.patchValue(data);
          this.blockedDocument = false;
          this.atualizaTituloBanner();
        }, (error) => {
          this.errorHandlerService.handle(error);
          this.blockedDocument = false;
          this.atualizaTituloBanner();
        });
    } else {
      this.atualizaTituloBanner();
      this.blockedDocument = false;
    }
  }

  private atualizaTituloBanner(): void {
       this.titulobanner = this.frmLancamento.get('codigo').value ? 'Edição de Lançamento' : 'Novo Lançamento';
  }

  converterDatas(lancamento) {
    lancamento.dataVencimento = lancamento.dataVencimento ? moment(lancamento.dataVencimento, 'YYYY-MM-DD').toDate() : null;
    lancamento.dataPagamento = lancamento.dataPagamento ? moment(lancamento.dataPagamento, 'YYYY-MM-DD').toDate() : null;
  }

  carregarCategorias() {
    this.categoriaService.listarTodos()
      .subscribe((response) => this.categorias = this.categorias.concat(response.map(r => ({ label: r.nome, value: r.codigo })))
        , (error) => this.errorHandlerService.handle(error));
  }

  carregarPessoas() {
    this.pessoaService.listarTodosOrdemNome()
      .subscribe((response) => this.pessoas = this.pessoas.concat(response.map(r => ({ label: r.nome, value: r.codigo })))
        , (error) => this.errorHandlerService.handle(error));
  }

  salvar() {
    if (this.titulobanner === 'Novo Lançamento') {
      this.addLancamento();
    } else if (this.titulobanner === 'Edição de Lançamento') {
      this.editarLancamento();
    }
  }

  addLancamento() {
    this.blockedDocument = true;
    this.lancamentoService.salvar(this.frmLancamento.value)
      .subscribe((response) => {
        this.messageService.add({
          severity: 'success', summary: 'Registro de Lançamento',
          detail: `Lançamento de ${response.tipo} salvo com sucesso!`,
          closable: false, life: 5000
        });
      //  this.router.navigate(['/lancamentos', response.codigo]);
        this.titulobanner = 'Edição de Lançamento';
        this.frmLancamento.get('codigo').setValue(response.codigo);
        this.blockedDocument = false;
      }, (error) => {
        this.errorHandlerService.handle(error);
        this.blockedDocument = false;
      });
  }

  editarLancamento() {
    this.blockedDocument = true;
    this.lancamentoService.atualizar(this.frmLancamento.value)
      .subscribe((response) => {
        this.messageService.add({
          severity: 'success', summary: 'Registro de Lançamento',
          detail: `Lançamento de ${response.tipo} salvo com sucesso!`,
          closable: false, life: 5000
        });
        this.blockedDocument = false;
      }, (error) => {
        this.errorHandlerService.handle(error);
        this.blockedDocument = false;
      });
  }

  novo() {
    this.frmLancamento.reset();
    this.frmLancamento.get('tipo').setValue('RECEITA');
    this.titulobanner = 'Novo Lançamento';
  }

}
