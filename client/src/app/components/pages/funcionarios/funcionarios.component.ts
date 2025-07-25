import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

import { FuncionariosService } from '../../../services/funcionarios.service';
import { RegistrosService } from '../../../services/registros.service';
import { DependenciasService } from '../../../services/dependencias.service';
import { CargosService } from '../../../services/cargos.service';

import { getColor, adjustPageSize } from '../../../utils/utils';
import { DialogFuncionarioComponent } from './dialog-funcionario/dialog-funcionario.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ExcelService } from '../../../services/excel.service';
import { RotacionesService } from '../../../services/rotaciones.service';
import { NivelesService } from '../../../services/niveles.service';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.scss',
})
export class FuncionariosComponent implements AfterViewInit {
  idName: any;
  cargos: any[] = [];
  funcionarios: any[] = [];
  text: string = '';

  searchEstado: boolean = false;
  filtrarEstado: string = 'none';
  displayedColumns: string[] = [
    'nombre',
    'ci',
    'cargo',
    'dependencia',
    'contrato',
    'estado',
    'options',
  ];
  permissions: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private authService: AuthService,
    private cargosService: CargosService,
    private funcionariosService: FuncionariosService,
    private registrosService: RegistrosService,
    private rotacionService: RotacionesService,
    private dependenciasService: DependenciasService,
    private nivelesService: NivelesService,
    private excelService: ExcelService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.idName = this.authService.getUserNameValue().toString();
    this.authService.getAccessibleModules().subscribe((modules: any) => {
      if (modules && modules['funcionarios']) {
        this.permissions = modules['funcionarios'];
      }
    });
  }

  ngAfterViewInit(): void {
    this.visualizacionDatasource();
    this.load();
  }

  load() {
    this.filtrarEstado = 'none';
    this.loadFuncionariosAndRegistros();
    this.estadoByFilter(this.filtrarEstado);
  }

  private visualizacionDatasource() {
    // Ajustar el pageSize al inicializar
    adjustPageSize(this.paginator, this.dataSource);

    // Escuchar los cambios en el tamaño de pantalla
    window.addEventListener('resize', () => {
      adjustPageSize(this.paginator, this.dataSource);
    });

    // Conectar el paginador a la tabla
    this.dataSource.paginator = this.paginator;
  }

  async loadFuncionariosAndRegistros() {
    try {
      const combinedData = await forkJoin({
        funcionarios: this.funcionariosService.getFiltroCampos(
          'estado',
          'true'
        ),
        registros: this.registrosService.getFiltroCampos('estado', 'true'),
        rotaciones: this.rotacionService.getFiltroCampos('estado', 'true'),
        dependencias: this.dependenciasService.getFiltroCampos(
          'estado',
          'true'
        ),
        niveles: this.nivelesService.getNiveles(),
      }).toPromise();

      this.funcionarios = [
        ...this.combineData(
          combinedData?.funcionarios,
          combinedData?.registros,
          combinedData?.rotaciones,
          combinedData?.dependencias,
          combinedData?.niveles
        ),
      ];

      this.setupDataSource(this.funcionarios);
      this.cdr.detectChanges();
    } catch (error) {
      //console.error("Error al cargar datos:", error);
    }
  }

  private combineData(
    funcionarios: any[],
    registros: any[],
    rotaciones: any[],
    dependencias: any[],
    niveles: any[]
  ): any[] {
    const filteredRegistros = this.filterRegistros(registros);

    return funcionarios.map((funcionario: any) => {
      // Verificar que el funcionario no sea null o undefined y tenga _id
      if (!funcionario || !funcionario._id) {
        //console.error("Funcionario inválido:", funcionario);
        return funcionario; // O manejarlo de otra manera, como omitirlo del resultado
      }
      //console.log(filteredRegistros);

      const registrosFuncionario = filteredRegistros.filter(
        (registro: any) =>
          registro &&
          registro.id_funcionario &&
          registro.id_funcionario._id === funcionario._id
      );

      // Filtrar las rotaciones correspondientes a los registros del funcionario
      const rotacionesFuncionario = rotaciones.filter((rotacion: any) => {
        if (!rotacion.id_registro) {
          return false; // Omitir rotaciones sin id_registro
        }

        return registrosFuncionario.some((registro: any) => {
          return registro._id === rotacion.id_registro;
        });
      });

      // Obtener la dependencia solo si hay registros válidos
      const dependenciaId =
        registrosFuncionario.length > 0 && registrosFuncionario[0].id_cargo
          ? registrosFuncionario[0].id_cargo.id_dependencia
          : null;
      const dependencia = dependencias.find(
        (dep: any) => dep && dep._id === dependenciaId
      );

      // Obtener la dependencia solo si hay registros válidos
      const nivelId =
        registrosFuncionario.length > 0 && registrosFuncionario[0].id_cargo
          ? registrosFuncionario[0].id_cargo.id_nivel_salarial
          : null;
      const nivel = niveles.find((niv: any) => niv && niv._id === nivelId);

      const cargo =
        registrosFuncionario &&
        registrosFuncionario.length > 0 &&
        registrosFuncionario[0].id_cargo
          ? registrosFuncionario[0].id_cargo.nombre
          : 'SIN ASIGNACION';

      //console.log(registrosFuncionario);

      return {
        ...funcionario,
        registros: registrosFuncionario,
        rotaciones: rotacionesFuncionario,
        cargo: cargo,
        sigla: dependencia ? dependencia.sigla : 'Sin dependencia.',
        nombre_nivel: nivel ? nivel.nombre : 'Sin nivel.',
        haber_basico_nivel: nivel ? nivel.haber_basico : 'Sin nivel.',
      };
    });
  }

  private filterRegistros(registros: any[]): any[] {
    return registros.filter((r: any) => r.estado === true);
  }

  private setupDataSource(data: any[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const nombre =
        (data.nombre ? data.nombre : '').toLowerCase() +
        ' ' +
        (data.paterno ? data.paterno : '').toLowerCase() +
        ' ' +
        (data.materno ? data.materno : '').toLowerCase();
      const casada = (data.casada ? data.casada : '').toLowerCase();
      const ci = (data.ci ? data.ci : '') + (data.ext ? data.ext : '');

      const cargoToSearch = data.cargo ? data.cargo.toLowerCase() : '';
      const contratoToSearch =
        data.registros &&
        data.registros.length > 0 &&
        data.registros[0].id_cargo
          ? data.registros[0].id_cargo.contrato.toLowerCase()
          : '';
      const dependenciaToSearch = data.sigla ? data.sigla.toLowerCase() : '';
      //console.log(cargoToSearch);
      return (
        nombre.includes(filter) ||
        casada.includes(filter) ||
        ci.includes(filter) ||
        cargoToSearch.includes(filter) ||
        contratoToSearch.includes(filter) ||
        dependenciaToSearch.includes(filter)
      );
    };
  }

  loadCargos() {
    this.cargosService.getCargos().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      },
      (error) => {
        //console.error("Error al obtener los cargos:", error);
      }
    );
  }

  estadoByFilter(valor: string) {
    const acceso = Number(valor);
    let estado;

    if ([1, 2, 3, 4, 5].includes(acceso)) {
      estado = this.funcionarios.filter(
        (funcionario) =>
          Array.isArray(funcionario?.role) &&
          funcionario.role.some((access: any) => access.acceso === acceso)
      );
    } else if (acceso === 0) {
      estado = this.funcionarios.filter(
        (funcionario) =>
          !Array.isArray(funcionario?.role) || // role no es arreglo
          funcionario.role.length === 0 || // arreglo vacío
          !funcionario.role.some((access: any) => access.acceso !== undefined) // sin campo acceso
      );
    } else {
      estado = this.funcionarios;
    }

    this.setupDataSource(estado);
  }

  estadoSeleccion(event: any) {
    this.filtrarEstado = event.value;
    this.estadoByFilter(this.filtrarEstado);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearInput(input: HTMLInputElement): void {
    input.value = '';
    this.load();
  }

  filtradoExcel(): void {
    let anio = new Date().getFullYear();
    let filteredData = this.dataSource.filteredData;

    let acceso;
    if (this.filtrarEstado === '0') {
      acceso = 'SIN ACCESO';
    } else if (this.filtrarEstado === '1') {
      acceso = 'MiADMINISTRADOR';
    } else if (this.filtrarEstado === '2') {
      acceso = 'MiORGANIGRAMA';
    } else if (this.filtrarEstado === '3') {
      acceso = 'MiPOSTULANTE';
    } else if (this.filtrarEstado === '4') {
      acceso = 'MiORGANIZACION';
    } else if (this.filtrarEstado === '5') {
      acceso = 'MiMUNICIPIO';
    } else {
      acceso = 'GENERAL';
    }

    if (this.filtrarEstado.toString() === 'spin') {
      filteredData = filteredData.map((element: any) => {
        const rotacionesFuncionario = this.cargos.filter(
          (cargo: any) =>
            cargo &&
            element.rotaciones &&
            element.rotaciones.length > 0 &&
            cargo?._id === element.rotaciones[0].id_cargo_rotacion
        );

        const cargoPartida = this.cargos.filter(
          (cargo: any) =>
            cargo && cargo?._id === element?.registros[0].id_cargo._id
        );
        //console.log(rotacionesFuncionario);
        return {
          ...element,
          siglaRotacion:
            rotacionesFuncionario && rotacionesFuncionario.length > 0
              ? rotacionesFuncionario[0].sigla
              : '',
          partidaRotacionNombre:
            cargoPartida &&
            cargoPartida.length > 0 &&
            cargoPartida[0]?.id_partida &&
            cargoPartida[0].id_partida?.nombre
              ? cargoPartida[0].id_partida.nombre
              : '',

          partidaRotacionCodigo:
            cargoPartida &&
            cargoPartida.length > 0 &&
            cargoPartida[0]?.id_partida &&
            cargoPartida[0].id_partida?.codigo
              ? cargoPartida[0].id_partida.codigo
              : '',
        };
      });

      //console.log("resultado: ", filteredData);
    }
    this.excelService.exportRegistroFuncionarios(
      filteredData,
      'Accesos.xlsx',
      anio,
      'PLANILLA DE PERSONAL CON ACCESO ' + acceso,
      acceso
    );
  }

  public getColors(contrato: string): string {
    const color = getColor(contrato);
    return color;
  }

  view(element: any) {
    //console.log(element);
    let nombre = element && element.nombre ? element.nombre : '';
    let paterno = element && element.paterno ? ' ' + element.paterno : '';
    let materno = element && element.materno ? ' ' + element.materno : '';
    let casada = element && element.casada ? ' ' + element.casada : '';

    let nombreCompleto = nombre + paterno + materno + casada;
    //console.log(nombreCompleto);
    let cargo = 'SIN ASIGNACIÓN';
    if (element && element.registros && element.registros.length > 0) {
      cargo =
        (element.registros[0].id_cargo?.nombre
          ? element.registros[0].id_cargo?.nombre
          : '') +
        (element.registros[0].id_cargo.contrato
          ? ' (' + element.registros[0].id_cargo.contrato + ')'
          : '') +
        (element.registros[0].id_cargo.registro
          ? '(' + element.registros[0].id_cargo.registro + ')'
          : '(SIN REGISTRO)');
    }
    //console.log(cargo);
    let role = element.role && element.role.length > 0 ? element.role : '';
    const dialogRef = this.dialog.open(DialogFuncionarioComponent, {
      width: '600px',
      data: {
        _id: element._id,
        nombre: nombreCompleto,
        cargo: cargo,
        role: role,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.load();
      }
    });
  }

  reset(element: any) {
    //console.log(element);
    let nombre = element && element.nombre ? element.nombre : '';
    let paterno = element && element.paterno ? ' ' + element.paterno : '';
    let materno = element && element.materno ? ' ' + element.materno : '';
    let casada = element && element.casada ? ' ' + element.casada : '';

    let nombreCompleto = nombre + paterno + materno + casada;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `¿Esta seguro/a de reestablecer la contraseña de ${nombreCompleto}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const user = {
          id: element?._id,
          newPassword: element.ci,
        };
        this.authService.resetPassword(user).subscribe(
          (response: any) => {
            this.load();
          },
          (error: any) => {
            //console.error("Error al llamar al servicio:", error);
          }
        );
      } else {
        //console.log("La eliminación ha sido cancelada.");
      }
    });
  }

  modificar(element: any) {}
}
