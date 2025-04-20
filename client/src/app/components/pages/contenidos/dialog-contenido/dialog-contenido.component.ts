import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContenidosService } from '../../../../services/contenidos.service';

@Component({
  selector: 'app-dialog-contenido',
  templateUrl: './dialog-contenido.component.html',
  styleUrl: './dialog-contenido.component.scss',
})
export class DialogContenidoComponent {
  formulario: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogContenidoComponent>,
    private fb: FormBuilder,
    private contenidosService: ContenidosService
  ) {
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      encabezado: ['', Validators.required],
      descripcion: ['', Validators.required],
      denominacion: ['', Validators.required],
      categoria: ['', Validators.required],
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

  guardar() {
    if (this.formulario.valid) {
      const datos = Object.keys(this.formulario.value).reduce((acc, key) => {
        acc[key] = this.formulario.value[key].toUpperCase(); // ✅ Mayúsculas
        return acc;
      }, {} as any);

      this.contenidosService.addContenido(datos).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
