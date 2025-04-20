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

  constructor(
    private authService: AuthService,
    private contenidosService: ContenidosService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.idName = this.authService.getUserNameValue().toString();
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
