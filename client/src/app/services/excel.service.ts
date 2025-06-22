import { Injectable } from '@angular/core';
import { Row, Workbook, Worksheet } from 'exceljs';
import { formatDate } from '@angular/common';
import * as ej from 'exceljs';
import * as fs from 'file-saver';

import { Logos } from '../shared/resources/Logos';
import {
  EntidadAltaBaja,
  ordenarYAgruparEstructuraDatos,
} from '../utils/utilsExcel';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  private agregarLogos(id: number, worksheet: Worksheet): any {
    //Agregar las imagenes del encabezado
    worksheet.addImage(id, {
      tl: { col: 0, row: 0 },
      ext: { width: 80, height: 60 },
    });

    return;
  }

  private agregarFilaTitulos(
    nroFila: number,
    filaDatos: string[],
    worksheet: Worksheet
  ): any {
    let filaSubPeriodo = worksheet.insertRow(nroFila, filaDatos);
    filaSubPeriodo.font = {
      name: 'Arial',
      family: 4,
      size: 14,
      underline: 'none',
      bold: true,
    };

    //centrar y merge la fila de titulos
    worksheet.getCell(`C${nroFila}`).alignment = { horizontal: 'center' };
    //merge desde la columna C hasta la J
    worksheet.mergeCells(`C${nroFila}:J${nroFila}`);

    return;
  }

  private agregarFilaEncabezadosItem(
    encabezados: [],
    worksheet: Worksheet
  ): any {
    // Agregar fila de Encabezados
    const filaEncabezados = worksheet.addRow(encabezados);

    // Estilo de las celdas : Fill and Border
    filaEncabezados.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff949494' },
        bgColor: { argb: 'ff949494' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = {
        name: 'Arial',
        family: 4,
        size: 7,
        underline: 'none',
        bold: true,
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
    });

    return;
  }

  private formatearMonto(monto: any): any {
    const formateador = new Intl.NumberFormat('es-ES', {
      style: 'decimal',
      // currency: 'BOB',
      useGrouping: true,
      minimumFractionDigits: 2,
    });

    return formateador.format(monto);
  }

  private formatearFecha(fecha: string): string {
    return formatDate(fecha, 'dd/MM/yyyy', 'en-US');
  }

  private establecerAnchoColumnas(data: [], worksheet: Worksheet): any {
    data.forEach(function (value, i) {
      worksheet.getColumn(i + 1).width = value;
    });
  }

  private formatearFilaFuncionarios(
    row: Row,
    modificacion: boolean,
    esTituloDependencia: boolean,
    esSubtotal: boolean
  ): any {
    row.font = {
      name: 'Arial',
      family: 4,
      size: 7,
      underline: 'none',
      bold: false,
    };
    row.alignment = { vertical: 'middle' };
    row.height = 25;

    //Por defecto los valores de las celdas estan alineados a la izquierda
    //Obtener las celdas que necesitan estar centradas
    const centeredCells = [
      1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19,
    ];

    row.eachCell((cell, id) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      if (modificacion) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ff949494' },
          bgColor: { argb: 'ff949494' },
        };
      }

      if (centeredCells.find((element) => element === id)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }

      //Cargo: mostrar en doble linea si es necesario
      if (id === 4 || id === 18) {
        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true,
        };

        if (cell.value && cell.value.toString().length > 65) {
          cell.font = { name: 'Arial', family: 4, size: 6, underline: 'none' };
        }
      }

      //Columna `Dias Trabajados` en negrita
      if (id === 11 || id === 12 || id === 17 || id === 19) {
        cell.font = {
          name: 'Arial',
          family: 4,
          size: 7,
          underline: 'none',
          bold: true,
        };
      }

      if (esTituloDependencia) {
        cell.font = {
          name: 'Arial',
          family: 4,
          size: 7,
          underline: 'none',
          bold: true,
        };

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ff949494' },
          bgColor: { argb: 'ff949494' },
        };
      }

      if (esSubtotal) {
        cell.font = {
          name: 'Arial',
          family: 4,
          size: 7,
          underline: 'none',
          bold: true,
        };
        if (id === 2 || id === 11 || id === 12) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ff949494' },
            bgColor: { argb: 'ff949494' },
          };
        }
      }
    });
  }

  public async exportRegistroFuncionarios(
    data: any[],
    fileName: string,
    gestion: any,
    titulo: string,
    tipoContrato: string
  ) {
    // console.log(data);
    const subtituloPeriodo = `CORRESPONDIENTE A LA GESTIÓN ${gestion}`;
    const subtituloExpresado = '';

    //Encabezados de columna y anchos
    const encabezadosAncho = [
      ['Cant.', 5],
      ['NOMBRE COMPLETO', 27],
      ['C.I.', 10],
      ['CARGO', 40],
      ['N°', 5],
      ['CONTRATO', 10],
      ['FECHA DE NACIMIENTO', 12],
      ['FECHA DE INGRESO', 12],
      ['FECHA DE CONCLUSION', 12],
      ['NIVEL', 7],
      [`HABER BÁSICO`, 12],
      [`ESTADO`, 10],
    ];

    // Si el tipoContrato es "spin", agregamos las columnas adicionales
    if (tipoContrato === 'spin') {
      encabezadosAncho.push(
        ['CARGO ASIGNADO', 40],
        ['SECRETARÍA ASIGNADA', 12],
        ['NOMBRE PARTIDA', 40],
        ['CÓDIGO PARTIDA', 12]
      );
    }

    const encabezados: any = [];
    const anchos: any = [];

    encabezadosAncho.forEach(
      (item) => encabezados.push(item[0]) | anchos.push(item[1])
    );

    // Crear workbook and worksheet, configurar tamano de pagina y orientacion
    //papersize 5 : Legal
    //landscape : horizontal
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Servidores Públicos');
    worksheet.pageSetup = { paperSize: 5, orientation: 'landscape' };
    worksheet.views = [{ showGridLines: false }];

    // Agregar filas del Titulo y formato
    var valoresFila = [];
    valoresFila[1] = ''; //vacio en col A
    valoresFila[2] = ''; //vacio en col B
    valoresFila[3] = titulo; //empieza en col C
    this.agregarFilaTitulos(1, valoresFila, worksheet);
    valoresFila[3] = subtituloPeriodo;
    this.agregarFilaTitulos(2, valoresFila, worksheet);
    valoresFila[3] = subtituloExpresado;
    this.agregarFilaTitulos(3, valoresFila, worksheet);

    //Agregar las imagenes del encabezado
    const objLogos = new Logos();

    let logoInstitucionalElement = workbook.addImage({
      base64: objLogos.GetLogoTradicional(),
      extension: 'png',
    });
    this.agregarLogos(logoInstitucionalElement, worksheet);
    this.agregarFilaEncabezadosItem(encabezados, worksheet);

    let nombreSecretariaActual = 'Inicial';
    let funcionario_cargo = [];
    let salario = 0;
    let contador = 0;

    // Ordenado
    //const datosOrdenadosYAgrupados = ordenarYAgruparDatos(data);
    const datosOrdenadosYAgrupados = ordenarYAgruparEstructuraDatos(
      data,
      'registros[0].id_cargo.registro',
      'sigla',
      'Sin dependencia.'
    );

    datosOrdenadosYAgrupados.forEach((registro: any) => {
      //Determinar si se efectuo una Alta o Baja en el presente periodo
      //para establecer las etiquetas [A, B, A/B]
      //y para resaltar la fila si es que hubo uno de esos eventos
      let objAltaBaja = new EntidadAltaBaja();
      contador++;
      salario =
        registro.haber_basico_nivel && registro.haber_basico_nivel > 0
          ? this.formatearMonto(registro.haber_basico_nivel)
          : '';
      //montoTotal += salario;

      if (registro.sigla !== undefined) {
        let nombre = registro.nombre !== undefined ? registro.nombre : '';
        let paterno =
          registro.paterno !== undefined ? registro.paterno + ' ' : '';
        let materno =
          registro.materno !== undefined ? registro.materno + ' ' : '';

        let casada =
          registro.casada && registro.casada !== undefined
            ? registro.casada + ' '
            : '';

        let estado =
          registro.registros.length > 0 || registro.rotaciones.length > 0
            ? registro.rotaciones.length > 0
              ? 'ROTANDO'
              : 'ACTIVO'
            : 'INACTIVO';
        funcionario_cargo = [
          contador,
          paterno + materno + casada + nombre,
          registro.ext ? registro.ci + '-' + registro.ext : registro.ci,
          registro.cargo || '',
          registro.registros.length > 0 &&
          registro.registros[0].id_cargo?.registro
            ? registro.registros[0].id_cargo?.registro
            : '',
          registro.registros.length > 0 &&
          registro.registros[0].id_cargo?.contrato
            ? registro.registros[0].id_cargo?.contrato
            : '',
          registro.fecha_nacimiento
            ? this.formatearFecha(registro.fecha_nacimiento)
            : '',
          registro.registros.length > 0 && registro.registros[0].fecha_ingreso
            ? this.formatearFecha(registro.registros[0].fecha_ingreso)
            : '',
          registro.registros.length > 0 &&
          registro.registros[0].fecha_conclusion
            ? this.formatearFecha(registro.registros[0].fecha_conclusion)
            : '',
          registro.nombre_nivel,
          salario,
          estado,
        ];

        // Si es "spin", agregar las columnas adicionales
        if (tipoContrato === 'spin') {
          funcionario_cargo.push(
            registro.rotaciones[0]?.descripcion || '', // Cargo Asignado
            registro.siglaRotacion || '', // Secretaría Asignada
            registro.partidaRotacionNombre || '', // Nombre Partida
            registro.partidaRotacionCodigo || '' // Código Partida
          );
        }
      } else {
        funcionario_cargo = [''];
      }

      if (registro.sigla !== nombreSecretariaActual) {
        let secretaria = '';
        if (registro.sigla === 'SMFA') {
          secretaria = 'SECRETARIA MUNICIPAL DE FINANZAS Y ADMINISTRACION';
        } else if (registro.sigla === 'SMIS') {
          secretaria = 'SECRETARIA MUNICIPAL DE INFRAESTRUCTURA Y SERVICIOS';
        } else if (registro.sigla === 'SMS') {
          secretaria = 'SECRETARIA MUNICIPAL DE SALUD';
        } else if (registro.sigla === 'SMDHI') {
          secretaria = 'SECRETARIA MUNICIPAL DE DESARROLLO HUMANO INTEGRAL';
        } else if (registro.sigla === 'SMMTDP') {
          secretaria =
            'SECRETARIA MUNICIPAL DE LA MADRE TIERRA Y DESARROLLO PRODUCTIVO';
        } else if (registro.sigla === 'SMPDT') {
          secretaria =
            'SECRETARIA MUNICIPAL DE PLANIFICACION Y DESARROLLO TERRITORIAL';
        } else if (registro.sigla === 'DESPACHO') {
          secretaria = 'DESPACHO DEL ALCALDE';
        } else {
          secretaria = 'PERSONAL INACTIVO';
        }
        const titulo_seccion_unidad = [
          '**',
          secretaria,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ];

        // Si es "spin", agregar las columnas adicionales
        if (tipoContrato === 'spin') {
          titulo_seccion_unidad.push('', '', '', '', '');
        }

        var filaTituloDependencia = worksheet.addRow(titulo_seccion_unidad);
        this.formatearFilaFuncionarios(
          filaTituloDependencia,
          objAltaBaja.modificacion,
          true,
          false
        );

        var filaCompleta = filaTituloDependencia.getCell(1).$col$row;

        //centrar y merge la fila
        let nroFila = filaCompleta.split('$');
        worksheet.mergeCells(`B${nroFila[2]}:L${nroFila[2]}`);
        nroFila = [];

        nombreSecretariaActual = registro.sigla;
      }

      var row = worksheet.addRow(funcionario_cargo);
      this.formatearFilaFuncionarios(
        row,
        objAltaBaja.modificacion,
        false,
        false
      );
    });

    //Establecer ancho de columnas
    this.establecerAnchoColumnas(anchos, worksheet);

    // Generar archivo Excel con el nombre
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fileName);
    });
  }
}
