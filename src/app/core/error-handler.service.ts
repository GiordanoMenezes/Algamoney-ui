import { MessageService } from 'primeng/components/common/api';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export class NotAuthenticatedError { }

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private messageService: MessageService) { }

  getMessageService() {
    return this.messageService;
  }

  handle(errorResponse: any) {
    let msg: string, sum: string;
    if (typeof errorResponse === 'string') {
      sum = errorResponse;
      msg = '';
    } else if (errorResponse instanceof NotAuthenticatedError) {
      sum = 'Sessão Expirada';
      msg = 'Faça novamente o Login no sistema!';
    } else if (errorResponse instanceof HttpErrorResponse && errorResponse.status >= 400 && errorResponse.status <= 499) {
      sum = 'Operação Não Efetuada';
      msg = errorResponse.error[0] ? errorResponse.error[0].mensagemUsuario : errorResponse.error.mensagemUsuario;
      if (errorResponse.status === 403) {
        sum = 'Acesso não Permitido';
        msg = 'Usuário não tem permissão para essa ação';
      }
      if (errorResponse.status === 401 && errorResponse.error.error_description.startsWith('Invalid refresh token')) {
        sum = 'Sessão Expirada';
        msg = 'Faça novamente o Login no sistema!';
      }
    } else {
      sum = 'Operação Não Efetuada';
      msg = 'Erro de comunicação com o Servidor. Favor tente novamente ou contate o suporte.';
    }
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: sum, detail: msg, closable: false, life: 8000
    });
  }
}
