import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { server } from '../../environments/environment.staging';

const base_url = server.base_url + '/nivel';

@Injectable({
  providedIn: 'root',
})
export class NivelesService {
  constructor(private http: HttpClient) {}

  getNiveles(): Observable<any> {
    return this.http.get<any>(`${base_url}`);
  }

  getFiltroCampos(campo: string, valor: string) {
    return this.http.get<any>(`${base_url}/filtro/${campo}/${valor}`);
  }

  getNivelesById(id: string): Observable<any> {
    return this.http.get<any>(`${base_url}/${id}`);
  }
  addNivel(nivel: any) {
    return this.http.post<any>(`${base_url}`, nivel);
  }

  updateNivel(id: string, nivel: any) {
    return this.http.put<any>(`${base_url}/${id}`, nivel);
  }

  deleteNivel(id: string) {
    return this.http.delete<any>(`${base_url}/${id}`);
  }
}
