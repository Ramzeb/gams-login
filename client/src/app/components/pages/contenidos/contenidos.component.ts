import { Component, OnInit } from '@angular/core';
import { ContenidosService } from '../../../services/contenidos.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DialogContenidoComponent } from './dialog-contenido/dialog-contenido.component';

@Component({
  selector: 'app-contenidos',
  templateUrl: './contenidos.component.html',
  styleUrls: ['./contenidos.component.scss'],
})
export class ContenidosComponent implements OnInit {
  idName: any;
  contenidos: any[] = [];
  editandoId: string | null = null;
  formularios: { [id: string]: FormGroup } = {};
  permissions: string[] = [];

  backgrounds: string[] = [
    'linear-gradient(135deg, #81fbb87a 10%, #28c76f8c 100%)',
    'linear-gradient(135deg, #abdcff93 10%, #0396ffd7 100%)',
    'linear-gradient(135deg, #f97793bd 10%, #623aa28e 100%)',
    'linear-gradient(135deg, #fcd03198 10%, #f555558c 100%)',
    'linear-gradient(135deg, #f761a291 10%, #8c1bab 100%)',
    'linear-gradient(135deg, #92ffbfa4 10%, #0027617c 100%)',
    'linear-gradient(135deg, #52e5e7b4 10%, #120cb775 100%)',
    'linear-gradient(135deg, #fdd7199d 10%, #e8050591 100%)',
    'linear-gradient(135deg, #3b26677e 10%, #bc78ec81 100%)',
  ];

  constructor(
    private authService: AuthService,
    private contenidosService: ContenidosService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.idName = this.authService.getUserNameValue().toString();
    this.authService.getAccessibleModules().subscribe((modules: any) => {
      if (modules && modules['contenidos']) {
        this.permissions = modules['contenidos'];
      }
    });
  }

  ngOnInit(): void {
    this.cargarContenidos();
  }

  cargarContenidos() {
    this.contenidosService.getContenidos().subscribe((data) => {
      // Primero los activos, luego los inactivos
      this.contenidos = data.sort((a: any, b: any) => {
        return a.estado === b.estado ? 0 : a.estado ? -1 : 1;
      });
      this.generarFormularios();
    });
  }

  generarFormularios() {
    this.contenidos.forEach((contenido) => {
      this.formularios[contenido._id] = this.fb.group({
        titulo: [contenido.titulo || ''],
        encabezado: [contenido.encabezado || ''],
        descripcion: [contenido.descripcion || ''],
        denominacion: [contenido.denominacion || ''],
        categoria: [contenido.categoria || ''],
      });
    });
  }

  editar(id: string) {
    this.editandoId = id;
  }

  cancelar() {
    this.editandoId = null;
    this.generarFormularios();
  }

  guardar(id: string) {
    const form = this.formularios[id];
    if (form.valid) {
      const datosForm = form.value;

      // Convertir campos a mayúsculas
      const datosEnMayusculas = {
        ...datosForm,
        titulo: datosForm.titulo?.toUpperCase(),
        encabezado: datosForm.encabezado?.toUpperCase(),
        descripcion: datosForm.descripcion?.toUpperCase(),
        denominacion: datosForm.denominacion?.toUpperCase(),
        categoria: datosForm.categoria?.toUpperCase(),
      };

      this.contenidosService
        .updateContenido(id, datosEnMayusculas)
        .subscribe(() => {
          this.editandoId = null;
          this.cargarContenidos();
        });
    }
  }

  eliminar(id: string) {
    this.contenidosService.deleteElemento(id).subscribe(() => {
      this.cargarContenidos();
    });
  }

  toggleActivo(contenido: any) {
    const actualizado = {
      ...contenido,
      estado: !contenido.estado,
    };

    this.contenidosService
      .updateContenido(contenido._id, actualizado)
      .subscribe(() => {
        contenido.estado = !contenido.estado;
      });
  }

  capitalizePrimeraLetra(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  agregarContenido() {
    const dialogRef = this.dialog.open(DialogContenidoComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarContenidos();
    });
  }
}
