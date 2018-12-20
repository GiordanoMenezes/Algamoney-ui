import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private API: string;

  constructor(private http: HttpClient) {
     this.API = `${environment.apiEndpoint}/categorias`;
   }

  public listarTodos(): Observable<any> {
    return this.http.get<any>(`${this.API}`);
  }
}
