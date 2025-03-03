import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

interface Role {
  acceso: number;
  nivel: string;
  _id?: string;
}

@Component({
  selector: 'app-dialog-funcionario',
  templateUrl: './dialog-funcionario.component.html',
  styleUrl: './dialog-funcionario.component.scss',
})
export class DialogFuncionarioComponent implements OnInit {
  idName: any;
  registro: any;
  roleForm: FormGroup;

  sistemas = [
    { acceso: 1, nombre: 'MiAdministrador', niveles: ['user'] },
    {
      acceso: 2,
      nombre: 'MiOrganigrama',
      niveles: ['user', 'visitor', 'admin', 'root'],
    },
    {
      acceso: 3,
      nombre: 'MiPostulante',
      niveles: ['user', 'visitor', 'admin', 'root'],
    },
    {
      acceso: 4,
      nombre: 'MiSimulador',
      niveles: ['user', 'visitor', 'admin', 'root'],
    },
    { acceso: 5, nombre: 'MiMunicipio', niveles: ['user'] },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roleForm = this.fb.group({ roles: this.fb.array([]) });
  }

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data);
      this.roleForm = this.fb.group({
        roles: this.fb.array([]),
      });

      this.populateRoles();
      // Verificamos que roles tenga el tipo correcto
      const roles = this.roles.value as { activo: boolean; nivel: string }[];

      roles.forEach((role, index) => {
        this.onCheckboxChange(index); // Asegúrate de que el estado de cada rol se ajuste
      });
    }
  }
  get roles(): FormArray {
    return this.roleForm.get('roles') as FormArray;
  }

  populateRoles() {
    this.sistemas.forEach((sistema) => {
      const existingRole = this.data.role.find(
        (r: any) => r.acceso === sistema.acceso
      );
      this.roles.push(
        this.fb.group({
          acceso: sistema.acceso,
          nivel: [existingRole ? existingRole.nivel : ''],
          activo: [!!existingRole],
        })
      );
    });
  }

  guardar() {
    const rolesSeleccionados = (
      this.roleForm.value.roles as {
        acceso: number;
        nivel: string;
        activo: boolean;
      }[]
    )
      .filter(({ activo, nivel }) => activo && nivel !== '') // ✅ Solo roles activos con nivel definido
      .map(({ acceso, nivel }) => ({ acceso, nivel })); // 🔹 Mapea solo los campos necesarios

    console.log('Roles guardados:', rolesSeleccionados);

    // Aquí puedes hacer la petición HTTP para actualizar los roles del usuario en el backend.
    // if (this.data) {
    //   //console.log(this.data);
    //   let dataRestoreRegistro = {
    //     fecha_ingreso: this.registro.fecha_ingreso || '',
    //     fecha_conclusion: this.registro.fecha_conclusion || '',
    //   };
    //   let dataModifyRegistro = {
    //     fecha_ingreso: this.FormRegistro.value.fecha_ingreso || '',
    //     fecha_conclusion: this.FormRegistro.value.fecha_conclusion || '',
    //   };
    //   let result = compararCampos(
    //     dataRestoreRegistro,
    //     dataModifyRegistro,
    //     this.data._id
    //   );
    //   this.registroService
    //     .updateRegistro(this.data._id, {
    //       ...this.FormRegistro.value,
    //       userRegister: {
    //         user: this.idName,
    //         accion: 'UPDATE',
    //         modulo: 'REGISTROS',
    //         dato_inicial: result?.camposOriginales,
    //         dato_modificado: result?.camposModificados,
    //       },
    //     })
    //     .subscribe(
    //       (response) => {
    //         this.dialogRef.close(response);
    //         //console.log("Respuesta del servicio:", response);
    //       },
    //       (error) => {
    //         //console.error("Error al llamar al servicio:", error);
    //       }
    //     );
    // }
  }

  onCheckboxChange(index: number): void {
    const role = this.roles.controls[index];

    if (role.get('activo')?.value) {
      role.get('nivel')?.enable();
      role.get('nivel')?.setValidators([Validators.required]); // Hacer requerido
    } else {
      role.get('nivel')?.disable();
      role.get('nivel')?.clearValidators(); // Quitar validación
    }

    role.get('nivel')?.updateValueAndValidity();
  }

  isRequired(index: number): boolean {
    const role = this.roles.controls[index];
    return role.get('activo')?.value && role.get('nivel')?.hasError('required');
  }
}
