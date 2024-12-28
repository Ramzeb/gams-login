//login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  role: number = 1;
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}
  hidePassword = true;

  ngOnInit(): void {
    // Verifica si hay un nombre de usuario guardado en LocalStorage
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      this.username = rememberedUsername;
      this.rememberMe = true;
    }
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    this.authService
      .login({
        username: this.username.toUpperCase(),
        password: this.password,
        role: this.role,
      })
      .subscribe(
        (response: any) => {
          if (!response.success) {
            // Si la respuesta indica fallo, muestra el mensaje de error
            this.errorMessage = response.message;
            return;
          }
          this.authService.getUserRole().subscribe((userRole: any) => {
            //console.log(userRole);
            if (this.rememberMe) {
              // Si el checkbox está marcado, guarda el nombre de usuario en LocalStorage
              localStorage.setItem('rememberedUsername', this.username);
            } else {
              // Si no está marcado, elimina el nombre de usuario guardado
              localStorage.removeItem('rememberedUsername');
            }
            if (userRole === 'user') {
              this.router.navigate(['/funcionarios']);
            } else {
              this.errorMessage = 'Usuario sin rol válido.';
              return;
            }
          });
        },
        (error: any) => {
          // Manejo de errores de red u otros problemas
          this.errorMessage = 'Error al conectar con el servidor.';
        }
      );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
