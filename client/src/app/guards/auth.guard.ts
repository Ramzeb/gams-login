// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const moduleName = route.data['module'] as string;

    return combineLatest([
      this.authService.getAccessibleModules(), // ← ahora devuelve un objeto, no un array
    ]).pipe(
      take(1),
      map(([accessibleModules]) => {
        // 1. Verificar si está logueado
        if (!this.authService.isLoggedIn()) {
          this.router.navigate(['/login']);
          return false;
        }

        // 3. Si no hay módulos accesibles → cerrar sesión
        if (
          !accessibleModules ||
          typeof accessibleModules !== 'object' ||
          Object.keys(accessibleModules).length === 0
        ) {
          this.authService.logout();
          return false;
        }

        // Si el módulo actual no está entre los accesibles → cerrar sesión

        const posiblesModulos = ['funcionarios', 'contenidos'];

        // Obtener lista de módulos accesibles que también son válidos
        const userModules = Object.keys(accessibleModules).map((k) =>
          k.toLowerCase()
        );
        const validUserModules = userModules.filter((m) =>
          posiblesModulos.includes(m)
        );

        // Si no hay ningún módulo válido → cerrar sesión
        if (validUserModules.length === 0) {
          this.authService.logout();
          return false;
        }

        // Verificar si el módulo solicitado está entre los válidos para reenviarlo al que si tiene acceso
        const normalizedModule = moduleName?.trim().toLowerCase();
        if (normalizedModule && !validUserModules.includes(normalizedModule)) {
          // Redirigir al primer módulo válido si existe
          if (validUserModules.length > 0) {
            this.router.navigate([`/${validUserModules[0]}`]);
          } else {
            this.authService.logout();
          }
          return false;
        }

        // 4. Todo válido → acceso permitido
        return true;
      })
    );
  }
}
