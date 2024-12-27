import { FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

// convierte la primera letra en mayuscula y el resto en minuscula, ejemplo: Este Es El Ejemplo
export function ordenPalabras(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCurrentISODateTime(): string {
  return new Date().toISOString();
}

export function convertFromISO8601(isoDateString: string): Date {
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    throw new Error('Formato invalido ISO 8601');
  }

  return date;
}

//converitr fecha al formato: 23 de marzo de 2024
export function convertirFecha(dateString: string): string {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format!');
  }

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}

export function mesNumeralToLiteral(mes: any): string {
  var monthNames = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ];
  return monthNames[parseInt(mes) - 1];
}
//convierte valores numericos en letras, por ejemplo 33: treinta y tres.
export function numerosALetras(num: number): string {
  const units = [
    'cero',
    'uno',
    'dos',
    'tres',
    'cuatro',
    'cinco',
    'seis',
    'siete',
    'ocho',
    'nueve',
  ];
  const tens = [
    '',
    '',
    'veinte',
    'treinta',
    'cuarenta',
    'cincuenta',
    'sesenta',
    'setenta',
    'ochenta',
    'noventa',
  ];
  const teens = [
    'diez',
    'once',
    'doce',
    'trece',
    'catorce',
    'quince',
    'dieciséis',
    'diecisiete',
    'dieciocho',
    'diecinueve',
  ];
  const hundreds = [
    '',
    'ciento',
    'doscientos',
    'trescientos',
    'cuatrocientos',
    'quinientos',
    'seiscientos',
    'setecientos',
    'ochocientos',
    'novecientos',
  ];

  if (num === 0) return units[0];

  let words = '';

  if (num >= 1000) {
    let thousands = Math.floor(num / 1000);
    words += (thousands === 1 ? 'mil' : units[thousands] + ' mil') + ' ';
    num %= 1000;
  }

  if (num >= 100) {
    let hundred = Math.floor(num / 100);
    words += hundreds[hundred] + ' ';
    num %= 100;
  }

  if (num >= 20) {
    let ten = Math.floor(num / 10);
    words += tens[ten] + (num % 10 === 0 ? '' : ' y ') + ' ';
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + ' ';
    num = 0;
  }

  if (num > 0 && num < 10) {
    words += units[num] + ' ';
  }

  return words.trim();
}

export function existsValidator(
  control: AbstractControl,
  field: string,
  data: any,
  entities: any[]
): { [key: string]: any } | null {
  let value = control.value;
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    value = value.trim().replace(/\s+/g, ' ').toUpperCase();
  }
  let element = '';
  if (data) {
    element = data._id;
  }
  const exists = entities.some(
    (entity) => entity[field].toString() === value && entity._id !== element
  );
  return exists ? { [`${field}Exists`]: { value } } : null;
}

export function convertToUpperCase(form: FormGroup, fieldName: string): void {
  if (
    form.value[fieldName] &&
    form.value[fieldName] !== null &&
    form.value[fieldName] !== undefined
  ) {
    (form.value[fieldName] = form.value[fieldName]
      .trim()
      .replace(/\s+/g, ' ')).toUpperCase();
  }
}

export function convertToNumber(form: FormGroup, fieldName: string): void {
  if (
    form.value[fieldName] &&
    form.value[fieldName] !== null &&
    form.value[fieldName] !== undefined
  ) {
    form.value[fieldName] = parseInt(form.value[fieldName]);
  }
}

export function convertToDecimal(form: FormGroup, fieldName: string): void {
  if (
    form.value[fieldName] &&
    form.value[fieldName] !== null &&
    form.value[fieldName] !== undefined
  ) {
    form.value[fieldName] = parseFloat(form.value[fieldName]);
  }
}

export function getColor(contrato: string): string {
  switch (contrato) {
    case 'EVENTUAL':
      return '#5DADE2';
    case 'REMANENTE':
      return '#F5B041';
    case 'ITEM':
      return '#52BE80';
    case 'ENCABEZADO':
      return '#95a5a6';
    default:
      return 'white'; // Color por defecto
  }
}

export function getColorsColumns(contrato: string): string {
  switch (contrato) {
    case 'EVENTUAL':
      return 'rgb(16, 239, 255)';
    case 'REMANENTE':
      return 'rgb(255, 238, 0)';
    case 'ITEM':
      return 'rgb(51, 218, 0)';
    default:
      return '#fffff'; // Color por defecto
  }
}

export function getIniciales(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

export function limpiarObject(obj: any): any {
  const cleanedObj: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      cleanedObj[key] = obj[key];
    }
  }
  return cleanedObj;
}

export function formatearMonto(monto: any, digito: any): any {
  const formateador = new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    // currency: 'BOB',
    useGrouping: true,
    minimumFractionDigits: digito,
  });

  return formateador.format(monto);
}

//Comparar valores de campos para almacenar cambios específicos realizados y almacenarlos en logs_registers
export function compararCampos(
  dataRestoreFuncionario: any,
  dataModifyFuncionario: any,
  identifier: any
) {
  let camposModificados: any = { _id: identifier };
  let camposOriginales: any = { _id: identifier };

  // Función recursiva para comparar objetos, incluyendo el caso de fechas, booleanos y valores vacíos
  function compararObjetos(
    objOriginal: any,
    objModificado: any,
    camposModificadosRef: any,
    camposOriginalesRef: any
  ) {
    for (let key in objModificado) {
      if (objModificado.hasOwnProperty(key)) {
        // Si el valor es un objeto, realizar la comparación recursivamente
        if (
          typeof objModificado[key] === 'object' &&
          objModificado[key] !== null &&
          !(objModificado[key] instanceof Date)
        ) {
          // No es una fecha, es un objeto anidado, comparar recursivamente
          if (!camposModificadosRef[key]) {
            camposModificadosRef[key] = {};
            camposOriginalesRef[key] = {};
          }
          compararObjetos(
            objOriginal[key] || {},
            objModificado[key],
            camposModificadosRef[key],
            camposOriginalesRef[key]
          );

          // Si no hay cambios dentro del objeto, eliminamos las claves vacías
          if (Object.keys(camposModificadosRef[key]).length === 0) {
            delete camposModificadosRef[key];
            delete camposOriginalesRef[key];
          }
        } else {
          // Verificar si el valor es una cadena que podría representar una fecha
          if (
            typeof objModificado[key] === 'string' &&
            typeof objOriginal[key] === 'string'
          ) {
            const esFechaModificada = !isNaN(Date.parse(objModificado[key]));
            const esFechaOriginal = !isNaN(Date.parse(objOriginal[key]));

            if (esFechaModificada || esFechaOriginal) {
              // Comparar como fechas
              const fechaModificada = esFechaModificada
                ? new Date(objModificado[key]).toISOString()
                : '';
              const fechaOriginal = esFechaOriginal
                ? new Date(objOriginal[key]).toISOString()
                : '';

              if (fechaModificada !== fechaOriginal) {
                camposModificadosRef[key] =
                  fechaModificada || objModificado[key];
                camposOriginalesRef[key] = fechaOriginal || objOriginal[key];
              }
              continue; // Ya se trató como fecha, pasamos a la siguiente iteración
            }
          }

          // Comparar valores directamente, preservando booleanos y valores vacíos
          const valorModificado =
            objModificado[key] !== undefined ? objModificado[key] : '';
          const valorOriginal =
            objOriginal[key] !== undefined ? objOriginal[key] : '';

          if (valorModificado !== valorOriginal) {
            camposModificadosRef[key] = valorModificado;
            camposOriginalesRef[key] = valorOriginal;
          }
        }
      }
    }
  }

  // Iniciar la comparación de los dos objetos
  compararObjetos(
    dataRestoreFuncionario,
    dataModifyFuncionario,
    camposModificados,
    camposOriginales
  );

  // Verificar si realmente se hicieron cambios
  const keysModificados = Object.keys(camposModificados).filter(
    (key) => key !== '_id'
  );

  // Si no hay cambios reales, devolver null
  if (keysModificados.length === 0) {
    return null; // No hay cambios
  }

  return { camposModificados, camposOriginales };
}

export function adjustPageSize(paginator: MatPaginator, dataSource: any) {
  const screenHeight = window.innerHeight;
  //console.log(`Alto de la pantalla: ${screenHeight}px`);

  if (screenHeight <= 568) {
    paginator.pageSize = 5;
  } else if (screenHeight > 568 && screenHeight <= 618) {
    paginator.pageSize = 6;
  } else if (screenHeight > 618 && screenHeight <= 667) {
    paginator.pageSize = 7;
  } else if (screenHeight > 667 && screenHeight <= 717) {
    paginator.pageSize = 8;
  } else if (screenHeight > 717 && screenHeight <= 767) {
    paginator.pageSize = 9;
  } else if (screenHeight > 767 && screenHeight <= 821) {
    paginator.pageSize = 10;
  } else if (screenHeight > 821 && screenHeight <= 871) {
    paginator.pageSize = 11;
  } else if (screenHeight > 871 && screenHeight <= 921) {
    paginator.pageSize = 12;
  } else if (screenHeight > 921 && screenHeight <= 971) {
    paginator.pageSize = 13;
  } else if (screenHeight > 971 && screenHeight <= 1021) {
    paginator.pageSize = 14;
  } else if (screenHeight > 1021 && screenHeight <= 1071) {
    paginator.pageSize = 15;
  } else if (screenHeight > 1071 && screenHeight <= 1121) {
    paginator.pageSize = 16;
  } else if (screenHeight > 1121 && screenHeight <= 1171) {
    paginator.pageSize = 17;
  } else {
    paginator.pageSize = 18;
  }

  // Forzamos que el paginador se actualice
  dataSource.paginator = paginator;
}

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formGroup = control as any; // Cast al control para tratarlo como un FormGroup
    const start = formGroup.get('fecha_ingreso')?.value;
    const end = formGroup.get('fecha_conclusion')?.value;

    // Si las fechas existen y la fecha final es anterior a la fecha de ingreso
    if (start && end && end < start) {
      return { dateRangeInvalid: true };
    }
    return null;
  };
}
