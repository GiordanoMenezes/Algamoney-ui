import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}


@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private API: string;

  constructor(private http: HttpClient) {
    this.API = `${environment.apiEndpoint}/pessoas`;
   }

  public listar(filtro: PessoaFiltro): Observable<any> {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json'
      // }),
      params: new HttpParams({})
    };

    httpOptions.params = httpOptions.params.append('page', filtro.pagina.toString());
    httpOptions.params = httpOptions.params.append('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      httpOptions.params = httpOptions.params.append('nome', filtro.nome);
    }
    return this.http.get<any>(`${this.API}?sort=nome`, httpOptions);
  }

  public buscaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  public listarTodosOrdemNome(): Observable<any> {
    return this.http.get<any>(`${this.API}/allorderbynome`);
  }

  public salvar(pessoa: any): Observable<any> {
    return this.http.post<any>(`${this.API}`, pessoa);
  }

  public atualizar(pessoa: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${pessoa.codigo}`, pessoa);
  }

  public excluir(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${codigo}`);
  }

  public  alterarStatus(codigo: number, novostatus: boolean): Observable<any> {
     const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
     return this.http.put<any>(`${this.API}/${codigo}/ativo`, novostatus, httpOptions);
  }
}


