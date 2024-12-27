// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    // Acceder a la propiedad 'roles' usando notación de corchetes
    const allowedRoles = route.data['roles'] as Array<string>;

    // Obtener el rol actual suscribiéndose al observable
    return this.authService.getUserRole().pipe(
      map((currentUserRole: string) => {
        // Comprobar si el rol actual está incluido en los roles permitidos
        if (
          this.authService.isLoggedIn() &&
          allowedRoles.includes(currentUserRole)
        ) {
          return true;
        } else {
          // Usuario no autenticado o no tiene el rol permitido, redireccionar a login
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
