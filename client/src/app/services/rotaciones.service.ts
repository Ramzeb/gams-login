import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { server } from '../../environments/environment.staging';

const base_url = server.base_url + '/rotacion';

@Injectable({
  providedIn: 'root',
})
export class RotacionesService {
  constructor(private http: HttpClient) {}

  getRotaciones(): Observable<any> {
    return this.http.get<any>(`${base_url}`);
  }

  getRotacionById(id: string): Observable<any> {
    return this.http.get<any>(`${base_url}/${id}`);
  }

  getFiltroCampos(campo: string, valor: string) {
    return this.http.get<any>(`${base_url}/filtro/${campo}/${valor}`);
  }

  getFiltroElementos(elemento: string, campo: string, valor: string) {
    return this.http.get<any>(
      `${base_url}/campo/${elemento}/${campo}/${valor}`
    );
  }

  addRotacion(rotacion: any) {
    return this.http.post<any>(`${base_url}`, rotacion);
  }

  updateRotacion(id: string, rotacion: any) {
    return this.http.put<any>(`${base_url}/${id}`, rotacion);
  }

  deleteRotacion(id: string) {
    return this.http.delete<any>(`${base_url}/${id}`);
  }
}
