import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { server } from '../../environments/environment.staging';

const base_url = server.base_url + '/cargo';

@Injectable({
  providedIn: 'root',
})
export class CargosService {
  constructor(private http: HttpClient) {}

  getCargos(): Observable<any> {
    return this.http.get<any>(`${base_url}`);
  }

  getCargosById(id: string): Observable<any> {
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

  searchCargos(params: any): Observable<any> {
    return this.http.post<any>(`${base_url}/search`, params);
  }

  addCargo(cargo: any) {
    return this.http.post<any>(`${base_url}`, cargo);
  }

  updateCargo(id: string, cargo: any) {
    return this.http.put<any>(`${base_url}/${id}`, cargo);
  }

  deleteCargo(id: string) {
    return this.http.delete<any>(`${base_url}/${id}`);
  }
}
