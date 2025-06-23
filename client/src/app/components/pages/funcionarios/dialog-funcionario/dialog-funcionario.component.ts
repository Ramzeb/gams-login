import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dialog-funcionario',
  templateUrl: './dialog-funcionario.component.html',
  styleUrls: ['./dialog-funcionario.component.scss'],
})
export class DialogFuncionarioComponent implements OnInit {
  roleForm: FormGroup;
  Object = Object;

  funcionalidadesPostulante: any = {
    organizaciones: ['editar', 'agregar', 'descargar'],
    postulantes: ['editar', 'agregar', 'descargar', 'aprobar', 'aval'],
    representantes: [
      'editar',
      'agregar',
      'descargar',
      'funcionario',
      'postulante',
      'inactivo',
    ],
    aprobados: [
      'editar',
      'agregar',
      'descargar',
      'documento',
      'aprobar',
      'reprobar',
      'aval',
    ],
    funcionarios: ['editar', 'descargar', 'aval'],
    deshabilitados: ['editar', 'descargar', 'aval'],
  };

  sistemas = [
    { acceso: 1, nombre: 'MiAdministrador' },
    { acceso: 2, nombre: 'MiOrganigrama' },
    { acceso: 3, nombre: 'MiPostulante' },
    { acceso: 4, nombre: 'MiOrganizacion' },
    { acceso: 5, nombre: 'MiMunicipio' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogFuncionarioComponent>
  ) {
    this.roleForm = this.fb.group({ roles: this.fb.array([]) });
  }

  ngOnInit(): void {
    this.populateRoles();
    this.roles.controls.forEach((_, index) => this.onCheckboxChange(index));
  }

  get roles(): FormArray {
    return this.roleForm.get('roles') as FormArray;
  }

  populateRoles(): void {
    this.sistemas.forEach((sistema) => {
      const existing = this.data.role?.find(
        (r: any) => r.acceso === sistema.acceso
      );
      const modules =
        sistema.acceso === 3
          ? this.fb.group(this.buildModules(existing?.modules || {}))
          : this.fb.group({});
      const usuarios =
        sistema.acceso === 3
          ? this.fb.group(this.buildUsuarios(existing?.modules || {}))
          : this.fb.group({});

      this.roles.push(
        this.fb.group({
          acceso: sistema.acceso,
          activo: [!!existing],
          nivel: [existing?.nivel || (sistema.acceso === 3 ? 'visitor' : '')],
          modules,
          usuarios,
        })
      );
    });
  }

  buildModules(existingModules: any): any {
    const group: any = {};
    for (const mod in this.funcionalidadesPostulante) {
      const modPerms: any = {};
      this.funcionalidadesPostulante[mod].forEach((func: any) => {
        modPerms[func] = this.fb.control(
          !!existingModules?.[mod]?.includes(func)
        );
      });
      group[mod] = this.fb.group(modPerms);
    }
    return group;
  }

  buildUsuarios(existingModules: any): any {
    const group: any = {};
    for (const mod in this.funcionalidadesPostulante) {
      const tieneAcceso = Object.prototype.hasOwnProperty.call(
        existingModules,
        mod
      );
      group[mod] = new FormControl(tieneAcceso);
    }
    return group;
  }

  guardar(): void {
    const rolesSeleccionados = this.roles.controls
      .map((ctrl) => {
        const acceso = ctrl.get('acceso')?.value;
        const activo = ctrl.get('activo')?.value;
        const nivel = acceso === 3 ? 'visitor' : ctrl.get('nivel')?.value;

        if (!activo || !nivel) return null;

        const base: any = { acceso, nivel };

        if (acceso === 3) {
          const modules = ctrl.get('modules')?.value;
          const usuarios = ctrl.get('usuarios')?.value;
          const filtered: any = {};
          for (const m in modules) {
            const funcionesActivas = Object.keys(modules[m]).filter(
              (f) => modules[m][f]
            );
            if (funcionesActivas.length > 0) {
              filtered[m] = funcionesActivas;
            } else if (usuarios[m]) {
              filtered[m] = []; // acceso como usuario sin funcionalidades
            }
          }
          base.modules = filtered;
        }

        return base;
      })
      .filter(Boolean);

    const payload = {
      id: this.data._id,
      role: rolesSeleccionados,
      options: 3,
    };

    this.authService.updateRole(payload).subscribe(
      (res) => this.dialogRef.close(res),
      (err) => console.error('Error al guardar roles', err)
    );
  }

  // En onCheckboxChange habilitar o deshabilitar nivel solo si no es MiPostulante
  onCheckboxChange(index: number): void {
    const role = this.roles.at(index);
    const isActive = role.get('activo')?.value;
    const acceso = role.get('acceso')?.value;
    if (acceso !== 3) {
      if (isActive) {
        role.get('nivel')?.enable();
      } else {
        role.get('nivel')?.disable();
        role.get('nivel')?.setValue('');
      }
    } else {
      // Para MiPostulante nivel es fijo, no se habilita ni deshabilita
    }
  }

  isChecked(modulo: string, permiso: string): boolean {
    const miPostulante = this.roles.controls.find(
      (ctrl) => ctrl.get('acceso')?.value === 3
    );
    return (
      miPostulante?.get('modules')?.get(modulo)?.get(permiso)?.value || false
    );
  }

  onUsuarioToggle(index: number, modulo: string, checked: boolean): void {
    const usuarios = this.roles.at(index).get('usuarios') as FormGroup;
    usuarios.get(modulo)?.setValue(checked);

    if (!checked) {
      // Si se desmarca el acceso como usuario, limpiar todas las funcionalidades del módulo
      const modules = this.roles.at(index).get('modules') as FormGroup;
      const modGroup = modules.get(modulo) as FormGroup;

      if (modGroup) {
        Object.keys(modGroup.controls).forEach((func) => {
          modGroup.get(func)?.setValue(false);
        });
      }
    }
  }

  onPermissionChange(
    index: number,
    modulo: string,
    permiso: string,
    checked: boolean
  ): void {
    const modules = this.roles
      .at(index)
      .get('modules')
      ?.get(modulo) as FormGroup;
    modules.get(permiso)?.setValue(checked);

    const usuarios = this.roles.at(index).get('usuarios') as FormGroup;
    usuarios.get(modulo)?.setValue(true); // marcar acceso al módulo si se activa alguna función
  }
}
