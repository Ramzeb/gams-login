import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { server } from '../../environments/environment.staging';

const base_url = server.base_url + '/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = new BehaviorSubject<string>(this.getUserRoleFromStorage());
  private userName = new BehaviorSubject<string>(this.getUserNameFromStorage());
  private userId = new BehaviorSubject<string>(this.getUserIdFromStorage());
  private userFuncionario = new BehaviorSubject<string>(
    this.getUserFuncionarioFromStorage()
  );

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getUserIdFromStorage(): string {
    return localStorage.getItem('id') || '';
  }

  private getUserRoleFromStorage(): string {
    return localStorage.getItem('role') || '';
  }

  private getUserNameFromStorage(): string {
    return localStorage.getItem('name') || '';
  }

  private getUserFuncionarioFromStorage(): string {
    return localStorage.getItem('funcionario') || '';
  }

  getUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }

  getUserName(): Observable<string> {
    return this.userName.asObservable();
  }

  getUserNameValue(): string {
    return this.userName.getValue();
  }

  getUserFuncionario(): string {
    return this.userFuncionario.getValue();
  }

  login(credentials: {
    username: string;
    password: string;
    role: number;
  }): Observable<any> {
    // Realiza la autenticación en el sistema actual y luego en el sistema remoto
    return this.http.post<any>(`${base_url}`, credentials).pipe(
      tap((user) => {
        if (user && user.token) {
          //console.log(user);
          localStorage.setItem('token', user.token);
          localStorage.setItem('role', user.role);
          localStorage.setItem('name', user.name);
          localStorage.setItem('funcionario', user.funcionario);
          localStorage.setItem('id', credentials.username);
          this.loggedIn.next(true);
          this.userRole.next(user.role);
          this.userName.next(user.name);
          this.userFuncionario.next(user.funcionario);
          this.userId.next(credentials.username);
        }
      }),
      // Realiza la autenticación en el sistema remoto y guarda el token
      switchMap(() =>
        this.http.post<any>(base_url, credentials).pipe(
          tap((remoteUser) => {
            if (remoteUser && remoteUser.token) {
              localStorage.setItem('remote_token', remoteUser.token);
            }
          })
        )
      )
    );
  }

  logout(): boolean {
    localStorage.removeItem('token');
    localStorage.removeItem('remote_token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('funcionario');
    this.loggedIn.next(false);
    this.userRole.next('');
    this.userId.next('');
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
    return true;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}
