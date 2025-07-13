import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { server } from '../../environments/environment.staging';

const base_url = server.base_url + '/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userName = new BehaviorSubject<string>(this.getUserNameFromStorage());
  private userId = new BehaviorSubject<string>(this.getUserIdFromStorage());
  private userStatus = new BehaviorSubject<string>(this.getStatusFromStorage());
  private userDataSubject = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      this.userDataSubject.next(JSON.parse(savedData));
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getUserIdFromStorage(): string {
    return localStorage.getItem('id') || '';
  }

  private getUserNameFromStorage(): string {
    return localStorage.getItem('name') || '';
  }

  private getStatusFromStorage(): string {
    return localStorage.getItem('status') || '';
  }

  getUserName(): Observable<string> {
    return this.userName.asObservable();
  }

  getUserNameValue(): string {
    return this.userName.getValue();
  }

  getUserIdStatus(): string {
    return this.userId.getValue();
  }

  getUseStatus(): Observable<string> {
    return this.userStatus.asObservable();
  }

  getUserById(id: string): Observable<any> {
    const noCacheParam = `nocache=${Date.now()}`;
    return this.http.get<any>(`${base_url}/${id}?${noCacheParam}`);
  }

  updatePassword(user: {
    id: string;
    currentPassword: string;
    newPassword: string;
    options?: number;
  }) {
    user.options = 1;
    return this.http.put<any>(`${base_url}/${user.id}`, user);
  }

  resetPassword(user: { id: string; newPassword: string; options?: number }) {
    user.options = 2;
    return this.http.put<any>(`${base_url}/${user.id}`, user);
  }

  updateRole(user: { id: string; role: any; options?: number }) {
    user.options = 3;
    return this.http.put<any>(`${base_url}/${user.id}`, user);
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
          localStorage.setItem('token', user.token);
          localStorage.setItem('name', user.name);
          localStorage.setItem('id', user.id);
          localStorage.setItem('status', user.status);
          localStorage.setItem('modules', JSON.stringify(user.modules || {}));
          this.loggedIn.next(true);
          this.userName.next(user.name);
          this.userStatus.next(user.status);
          this.userId.next(user.id);
          this.userDataSubject.next({
            ...user,
            modules: user.modules || {},
          });
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

  // Método para manejar módulos accesibles
  getAccessibleModules(): Observable<string[]> {
    return this.userDataSubject.pipe(
      map((userData) => {
        // Primero intenta obtener de userData, luego de localStorage
        if (userData?.modules) {
          return userData.modules;
        }
        const savedModules = localStorage.getItem('modules');
        return savedModules ? JSON.parse(savedModules) : {};
      })
    );
  }

  hasAccessToModule(moduleName: string): Observable<boolean> {
    return this.getAccessibleModules().pipe(
      map((modules) => modules.includes(moduleName))
    );
  }

  logout(): boolean {
    localStorage.removeItem('token');
    localStorage.removeItem('remote_token');
    localStorage.removeItem('name');
    localStorage.removeItem('status');
    localStorage.removeItem('id');
    localStorage.removeItem('modules');

    // Detenemos la verificación del estado
    this.dialog.closeAll();

    this.loggedIn.next(false);
    this.userId.next('');
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
    return true;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}
