export class EntidadAltaBaja {
  modificacion: boolean;
  etiquetaAltaBaja: string;
  diasTrabajados: number;

  constructor() {
    //Valores por defecto
    this.modificacion = false;
    this.diasTrabajados = 30;
    this.etiquetaAltaBaja = "";
  }

  public procesarEvento(data: any, mes: number, gestion: any): any {
    const estadoRegistro = data.estado;
    let contrato =
      data.id_cargo && data.id_cargo.contrato ? data.id_cargo.contrato : "";

    let fechaIngreso = new Date(data.fecha_ingreso);
    let fechaConclusion = new Date(data.fecha_conclusion);
    let diaIngreso = fechaIngreso.getUTCDate(); //#dia del mes

    //Verificar si la baja se dio en el periodo solicitado
    if (estadoRegistro === false && data.fecha_conclusion) {
      //console.log("Ruta Registro.estado=False para: " + data.ci);

      //Date.getMonth() : valores para Enero[0] a Diciembre[11]
      //Por eso se suma 1
      if (
        fechaConclusion.getMonth() + 1 === mes &&
        fechaConclusion.getFullYear() === gestion
      ) {
        let diaConclusion =
          fechaConclusion.getUTCDate() === 31
            ? 30
            : fechaConclusion.getUTCDate();

        //Verificar si la fecha de ingreso se dio en el mismo mes
        if (
          fechaIngreso.getMonth() + 1 === mes &&
          fechaIngreso.getFullYear() === gestion
        ) {
          this.diasTrabajados =
            diaConclusion - (diaIngreso === 1 ? 0 : diaIngreso - 1);
          this.etiquetaAltaBaja = "AB";
          this.modificacion = true;
        } else {
          //Es anterior al presente mes,
          //se obtienen los dias del mes hasta la fecha de conclusion
          this.diasTrabajados = diaConclusion;
          if (contrato === "EVENTUAL" || contrato === "ITEM") {
            this.etiquetaAltaBaja = "B";
          } else {
            this.etiquetaAltaBaja = "BR";
          }

          this.modificacion = true;
        }
      }
    } else {
      //Verificar si la alta se dio en el mes solicitado
      if (
        fechaIngreso.getMonth() + 1 === mes &&
        fechaIngreso.getFullYear() === gestion
      ) {
        //console.log("Ruta Registro.estado=True alta para: " + data.ci);
        this.modificacion = true;
        this.diasTrabajados = 30 - (diaIngreso === 1 ? 0 : diaIngreso - 1);
        if (contrato === "EVENTUAL" || contrato === "ITEM") {
          this.etiquetaAltaBaja = "A";
        } else {
          this.etiquetaAltaBaja = "AR";
        }
      }
    }
    return;
  }
}

// Función reutilizable para ordenar y agrupar
export function ordenarYAgruparEstructuraDatos<T>(
  data: T[],
  campoOrden: string,
  campoAgrupar: string,
  valorEspecial: string
): T[] {
  const obtenerValorSeguro = (objeto: any, ruta: string): any => {
    return ruta.split(".").reduce((valor, key) => {
      // Verificamos si el valor es un arreglo y accedemos al índice
      if (key.endsWith("]")) {
        const arrayKey = key.slice(0, key.indexOf("[")); // Obtener el nombre del arreglo
        const index = parseInt(key.match(/\[(\d+)\]/)?.[1] ?? "-1"); // Obtener el índice
        if (valor && Array.isArray(valor[arrayKey])) {
          return valor[arrayKey][index] ?? null;
        }
        return null;
      } else {
        return valor?.[key] ?? null;
      }
    }, objeto);
  };

  // Ordenamos primero
  const datosOrdenados = data.sort((a, b) => {
    const valorA = obtenerValorSeguro(a, campoOrden);
    const valorB = obtenerValorSeguro(b, campoOrden);

    // Si alguno de los valores es null o undefined, lo consideramos como mayor para ubicarlo al final
    if (valorA === null || valorA === undefined) return 1;
    if (valorB === null || valorB === undefined) return -1;

    // Hacemos la comparación numérica
    return valorA - valorB;
  });

  // Agrupamos por el campo deseado
  const agrupadosPorCampo = datosOrdenados.reduce((acc, item) => {
    const valorAgrupar =
      obtenerValorSeguro(item, campoAgrupar) ?? "Sin dependencia.";
    if (!acc[valorAgrupar]) {
      acc[valorAgrupar] = [];
    }
    acc[valorAgrupar].push(item);
    return acc;
  }, {} as Record<string, T[]>);

  // Convertimos el objeto agrupado en un arreglo
  const resultado = Object.keys(agrupadosPorCampo)
    .sort((a, b) => {
      if (a === valorEspecial) return 1; // Ubicar el valor especial al final
      if (b === valorEspecial) return -1;
      return a.localeCompare(b);
    })
    .reduce((acc, key) => {
      return acc.concat(agrupadosPorCampo[key]);
    }, [] as T[]);

  return resultado;
}

// Función auxiliar para obtener valores seguros de objetos anidados
export function obtenerValorSeguro(obj: any, campo: string): any {
  return campo
    .split(".")
    .reduce((o, key) => (o && o[key] !== undefined ? o[key] : ""), obj);
}
