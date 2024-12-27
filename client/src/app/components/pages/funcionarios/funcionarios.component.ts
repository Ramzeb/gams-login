import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { switchMap, map, catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

import { FuncionariosService } from '../../../services/funcionarios.service';
import { RegistrosService } from '../../../services/registros.service';
import { DependenciasService } from '../../../services/dependencias.service';
import { CargosService } from '../../../services/cargos.service';

import {
  limpiarObject,
  ordenPalabras,
  getColor,
  adjustPageSize,
} from '../../../utils/utils';

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
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private authService: AuthService,
    private cargosService: CargosService,
    private funcionariosService: FuncionariosService,
    private registrosService: RegistrosService,
    private dependenciasService: DependenciasService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.idName = this.authService.getUserNameValue().toString();
  }

  ngAfterViewInit(): void {
    //this.visualizacionDatasource();
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

  //   loadFuncionariosAndRegistros() {
  //     forkJoin({
  //       funcionarios: this.funcionariosService
  //         .getFuncionarios()
  //         .pipe(map((data) => data || [])),
  //       registros: this.registrosService
  //         .getRegistros()
  //         .pipe(map((data) => data || [])),
  //       rotaciones: this.rotacionService
  //         .getFiltroCampos("estado", "true")
  //         .pipe(map((data) => data || [])),
  //       dependencias: this.dependenciasService
  //         .getDependencias()
  //         .pipe(map((data) => data || [])),
  //       niveles: this.nivelesService.getNiveles().pipe(map((data) => data || [])),
  //       solicitudes: this.solicitudService
  //         .getFiltroCampos("estado", "PENDIENTE")
  //         .pipe(map((data) => data || [])),
  //     })
  //       .pipe(
  //         map(
  //           ({
  //             funcionarios,
  //             registros,
  //             rotaciones,
  //             dependencias,
  //             niveles,
  //             solicitudes,
  //           }) => {
  //             return this.combineData(
  //               funcionarios,
  //               registros,
  //               rotaciones,
  //               dependencias,
  //               niveles,
  //               solicitudes
  //             );
  //           }
  //         )
  //       )
  //       .subscribe(
  //         (combinedData) => {
  //           this.funcionarios = combinedData;
  //           this.setupDataSource(combinedData);
  //         },
  //         (error) => {
  //           //console.error("Error al obtener los datos:", error);
  //         }
  //       );
  //   }

  async loadFuncionariosAndRegistros() {
    try {
      const combinedData = await forkJoin({
        funcionarios: this.funcionariosService.getFiltroCampos(
          'estado',
          'true'
        ),
        registros: this.registrosService.getRegistros(),
        dependencias: this.dependenciasService.getFiltroCampos(
          'estado',
          'true'
        ),
        //detalles: this.detalleService.getDetalles(),
      }).toPromise();

      this.funcionarios = [
        ...this.combineData(
          combinedData?.funcionarios,
          combinedData?.registros,
          combinedData?.dependencias
          //combinedData?.detalles
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
    dependencias: any[]
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

      // Obtener la dependencia solo si hay registros válidos
      const dependenciaId =
        registrosFuncionario.length > 0 && registrosFuncionario[0].id_cargo
          ? registrosFuncionario[0].id_cargo.id_dependencia
          : null;
      const dependencia = dependencias.find(
        (dep: any) => dep && dep._id === dependenciaId
      );

      const cargo =
        registrosFuncionario.length > 0 && registrosFuncionario[0].id_cargo
          ? registrosFuncionario[0].id_cargo.nombre
          : 'SIN ASIGNACION';

      // Calcular días de vacaciones para contratos tipo "ITEM"
      let diasVacaciones = 0;
      if (registrosFuncionario.length > 0) {
        const registro = registrosFuncionario[0];
        let contrato =
          registrosFuncionario.length > 0 && registrosFuncionario[0].id_cargo
            ? registrosFuncionario[0].id_cargo.contrato
            : 'SIN ASIGNACION';
        if (contrato === 'ITEM') {
          const fechaIngreso = new Date(registro.fecha_ingreso);
          const fechaActual = new Date();

          // Calcular años de servicio
          let añosServicio =
            fechaActual.getFullYear() - fechaIngreso.getFullYear();

          // Ajustar por diferencia de meses y días
          if (
            fechaActual.getMonth() < fechaIngreso.getMonth() ||
            (fechaActual.getMonth() === fechaIngreso.getMonth() &&
              fechaActual.getDate() < fechaIngreso.getDate())
          ) {
            añosServicio--;
          }

          // Calcular días de vacaciones en función de los años de servicio
          if (añosServicio >= 1) {
            if (añosServicio === 1) {
              diasVacaciones = 15;
            } else if (añosServicio >= 2 && añosServicio <= 5) {
              // Hasta el quinto año, 15 días anuales
              diasVacaciones = 15 * 2;
            } else if (añosServicio === 6) {
              diasVacaciones = 15 + 20;
            } else {
              // A partir del sexto año, 20 días anuales
              diasVacaciones = 20 * 2; // Vacaciones acumuladas de los últimos dos años
            }
          }
        }
      }

      //console.log(registrosFuncionario);

      return {
        ...funcionario,
        registros: registrosFuncionario,
        cargo: cargo,
        sigla: dependencia ? dependencia.sigla : 'Sin dependencia.',
        diasVacaciones,
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
      //   const cargoToSearch =
      //     data.registros &&
      //     data.registros.length > 0 &&
      //     data.registros[0].id_cargo
      //       ? data.registros[0].id_cargo.nombre.toLowerCase()
      //       : "";

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
    let estado;
    if (valor === 'true') {
      estado = this.funcionarios.filter(
        (funcionario) => funcionario.estado === true
      );
      this.setupDataSource(estado);
    } else if (valor === 'false') {
      estado = this.funcionarios.filter(
        (funcionario) => funcionario.estado === false
      );
      this.setupDataSource(estado);
    } else if (valor === 'spin') {
      estado = this.funcionarios.filter(
        (funcionario) =>
          funcionario.rotaciones &&
          funcionario.rotaciones.length > 0 &&
          funcionario.rotaciones[0].estado === true
      );
      this.setupDataSource(estado);
    } else {
      this.setupDataSource(this.funcionarios);
    }
  }

  estadoSeleccion(event: any) {
    this.filtrarEstado = event.value;
    //console.log(this.filtrarEstado);
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
    const filteredData = this.dataSource.filteredData;
    //console.log(filteredData);
    // this.excelService.exportRegistroFuncionarios(
    //   filteredData,
    //   'funcionarios.xlsx',
    //   anio
    // );
  }

  public getColors(contrato: string): string {
    const color = getColor(contrato);
    return color;
  }

  view(funcionario: any) {
    // const dialogRef = this.dialog.open(DialogFuncionarioComponent, {
    //   width: '600px',
    //   data: funcionario, // Pasar los datos del cargo al componente de edición
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.load();
    //   }
    // });
  }
}
