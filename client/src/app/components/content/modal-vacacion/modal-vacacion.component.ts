import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-vacacion',
  templateUrl: './modal-vacacion.component.html',
  styleUrls: ['./modal-vacacion.component.scss'],
})
export class ModalVacacionComponent {
  jornada: 'completa' | 'media' | null = null;
  turno: 'mañana' | 'tarde' | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalVacacionComponent>
  ) {}

  seleccionarJornada(opcion: 'completa' | 'media') {
    this.jornada = opcion;
    if (opcion === 'completa') {
      this.turno = null; // Limpiamos el turno si se elige jornada completa
    }
  }

  confirmar() {
    this.dialogRef.close({ jornada: this.jornada, turno: this.turno });
  }

  cancelar() {
    this.dialogRef.close(null); // Cierra sin selección
  }

  puedeConfirmar(): boolean {
    if (this.jornada === 'completa') {
      return true; // Jornada completa no necesita turno
    }
    if (this.jornada === 'media') {
      return this.turno !== null; // Media jornada necesita un turno seleccionado
    }
    return false; // No se ha seleccionado ninguna jornada
  }
}
