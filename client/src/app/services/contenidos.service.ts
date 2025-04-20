import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { server } from '../../environments/environment.staging';

const base_url = server.base_url + '/contenido';

@Injectable({
  providedIn: 'root',
})
export class ContenidosService {
  constructor(private http: HttpClient) {}

  getContenidos(): Observable<any> {
    return this.http.get<any>(`${base_url}`);
  }

  getFiltroCampos(campo: string, valor: string) {
    return this.http.get<any>(`${base_url}/filtro/${campo}/${valor}`);
  }

  getContenidosById(id: string): Observable<any> {
    return this.http.get<any>(`${base_url}/${id}`);
  }

  addContenido(contenido: any) {
    return this.http.post<any>(`${base_url}`, contenido);
  }

  updateContenido(id: string, contenido: any) {
    return this.http.put<any>(`${base_url}/${id}`, contenido);
  }

  deleteElemento(id: string) {
    return this.http.delete<any>(`${base_url}/${id}`);
  }
}
