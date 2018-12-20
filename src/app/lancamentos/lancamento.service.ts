import { Injectable} from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';



export class LancamentoFiltro {
  descricao: string;
  vencimentoDe: Date;
  vencimentoAte: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

   private API: string;

  constructor(private http: HttpClient) {
    this.API = `${environment.apiEndpoint}/lancamentos`;
   }

  public listar(filtro: LancamentoFiltro): Observable<any> {
    const httpOptions = {
            // headers: new HttpHeaders({
      //   'Content-Type': 'application/json'
      // }),
      params: new HttpParams({
      })
    };
    httpOptions.params = httpOptions.params.append('page', filtro.pagina.toString());
    httpOptions.params = httpOptions.params.append('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      httpOptions.params = httpOptions.params.append('descricao', filtro.descricao);
    }
    if (filtro.vencimentoDe) {
      httpOptions.params = httpOptions.params.append('vencimentoDe', moment(filtro.vencimentoDe).format('YYYY-MM-DD'));
    }
    if (filtro.vencimentoAte) {
      httpOptions.params = httpOptions.params.append('vencimentoAte', moment(filtro.vencimentoAte).format('YYYY-MM-DD'));
    }
    return this.http.get<any>(`${this.API}?resumo&sort=descricao`, httpOptions);
  }

  public buscaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  public salvar(lancamento: any): Observable<any> {
    return this.http.post<any>(`${this.API}`, lancamento);
  }

  public atualizar(lancamento: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${lancamento.codigo}`, lancamento);
  }

  public excluir(codigo: number): Observable<void> {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json'
    //   })
    // };
    return this.http.delete<void>(`${this.API}/${codigo}`);
  }
}
