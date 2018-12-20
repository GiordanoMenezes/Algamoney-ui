import { MessageService } from 'primeng/components/common/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  titulobanner = '';

  blockedDocument = false;

  frmPessoa = this.fb.group({
    codigo: [null],
    nome: [null, [Validators.required, Validators.minLength(5)]],
    ativo: [true],
    endereco: this.fb.group({
      logradouro: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null],
      bairro: [null, Validators.required],
      cep: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required]
    })
  });

  constructor(private fb: FormBuilder, private pessoaService: PessoaService,
    private messageService: MessageService, private errorHandlerService: ErrorHandlerService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.blockedDocument = true;
    const par = this.activatedRoute.snapshot.params['codigo'];
    if (par) {
      this.pessoaService.buscaPorId(par)
      .subscribe((data) => {
        this.frmPessoa.patchValue(data);
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
    this.titulobanner = this.frmPessoa.get('codigo').value ? 'Edição de Pessoa' : 'Nova Pessoa';
}

salvar() {
  if (this.titulobanner === 'Nova Pessoa') {
    this.addPessoa();
  } else if (this.titulobanner === 'Edição de Pessoa') {
    this.editarPessoa();
  }
}

  addPessoa() {
    this.blockedDocument = true;
    this.pessoaService.salvar(this.frmPessoa.value)
      .subscribe((data) => {
        this.messageService.add({
          severity: 'success', summary: 'Cadastro de Pessoa', detail: `Pessoa ${data.nome} salva com sucesso!`,
          closable: false, life: 5000
        });
        this.titulobanner = 'Edição de Pessoa';
        this.frmPessoa.get('codigo').setValue(data.codigo);
        this.blockedDocument = false;
      }, (error) => {
        this.errorHandlerService.handle(error);
        this.blockedDocument = false;
      });
  }

  editarPessoa() {
    this.blockedDocument = true;
    this.pessoaService.atualizar(this.frmPessoa.value)
      .subscribe((data) => {
        this.messageService.add({
          severity: 'success', summary: 'Cadastro de Pessoa',
          detail: `Pessoa ${data.nome} salva com sucesso!`,
          closable: false, life: 5000
        });
        this.blockedDocument = false;
      }, (error) => {
        this.errorHandlerService.handle(error);
        this.blockedDocument = false;
      });
  }

  novo() {
    this.frmPessoa.reset();
    this.titulobanner = 'Nova Pessoa';
    this.frmPessoa.get('ativo').setValue(true);
  }

}
