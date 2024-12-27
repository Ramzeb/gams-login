// controller.js
async function getAll(
  model,
  req,
  res,
  message,
  references = [],
  values = {},
  changeMap = {},
  date = []
) {
  try {
    let query = model.find({}, values);

    // Ordenar los resultados por _id en orden descendente
    query.sort({ _id: -1 });
    if (references.length > 0) {
      query = query.populate(
        references.map((ref) => ({ path: ref, select: "-__v" }))
      );
    }

    let data = await query;
    if (!data.length) {
      return res.status(404).json({ message: `No se encontraron ${message}` });
    }
    if (Object.keys(changeMap).length > 0) {
      data = data.map((item) => {
        let modifiedItem = { ...item.toObject() };
        Object.entries(changeMap).forEach(([key, value]) => {
          if (value === undefined) {
            delete modifiedItem[key];
          } else {
            if (value.prop) {
              modifiedItem[value.field] = item[key]
                ? item[key][value.prop]
                : null;
            } else {
              modifiedItem[value.field] = item[key] ? item[key] : null;
            }
          }
        });
        return modifiedItem;
      });
    }
    //convierte los campos recibidos que son tipo fecha al formato dd-mm-yy
    // if (date.length > 0) {
    //   data = data.map((item) => {
    //     let modifiedItem = { ...item.toObject() };
    //     date.forEach((fieldName) => {
    //       if (modifiedItem[fieldName]) {
    //         modifiedItem[fieldName] = formatDate(modifiedItem[fieldName]);
    //       }
    //     });
    //     return modifiedItem;
    //   });
    // }
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al obtener ${message}`, error: error.message });
  }
}

async function getById(model, req, res, message, references = []) {
  try {
    let query = model.findById(req.params.id);
    if (references.length > 0) {
      query = query.populate(
        references.map((ref) => ({ path: ref, select: "-__v" }))
      );
    }

    const item = await query;
    if (!item) {
      return res.status(404).json({
        message: `${message} no encontrad${message.endsWith("a") ? "a" : "o"}`,
      });
    }
    res.json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al obtener ${message}`, error: error.message });
  }
}

async function getByFilter(
  model,
  req,
  res,
  message,
  references = [],
  values = {},
  changeMap = {}
) {
  try {
    let query = model.find({ [req.params.campo]: req.params.value }, values);

    if (references.length > 0) {
      query = query.populate(
        references.map((ref) => ({ path: ref, select: "-__v" }))
      );
    }
    let items = await query;
    let data = items.filter((item) => item[req.params.campo] !== null);
    if (!data) {
      return res.status(404).json({
        message: `${message} no encontrad${message.endsWith("a") ? "a" : "o"}`,
      });
    }

    if (Object.keys(changeMap).length > 0) {
      data = data.map((item) => {
        let modifiedItem = { ...item.toObject() };
        Object.entries(changeMap).forEach(([key, value]) => {
          if (value === undefined) {
            delete modifiedItem[key];
          } else {
            if (value.prop) {
              modifiedItem[value.field] = item[key]
                ? item[key][value.prop]
                : null;
            } else {
              modifiedItem[value.field] = item[key] ? item[key] : null;
            }
          }
        });
        return modifiedItem;
      });
    }
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al obtener ${message}`, error: error.message });
  }
}

async function getByFilterCamp(
  model,
  req,
  res,
  message,
  references = [],
  values = {},
  changeMap = {},
  estado = null
) {
  try {
    let query = model
      .find({}, values)
      .populate(references.map((ref) => ({ path: ref })))
      .populate({
        path: req.params.elemento,
        match: { [req.params.campo]: req.params.value },
      })
      .exec();

    let items = await query;
    //Agregar filtrado por estado
    let data = items.filter((item) => item[req.params.elemento] !== null);
    if (estado) {
      if (estado === true) {
        data = data.filter((item) => {
          return item.estado === true;
        });
      } else {
        data = data.filter((item) => {
          return item.estado === true;
        });
      }
    }

    if (!data.length) {
      return res.status(404).json({ message: `No se encontraron ${message}` });
    }

    if (Object.keys(changeMap).length > 0) {
      data = data.map((item) => {
        let modifiedItem = { ...item.toObject() };
        Object.entries(changeMap).forEach(([key, value]) => {
          if (value === undefined) {
            delete modifiedItem[key];
          } else {
            if (value.prop) {
              modifiedItem[value.field] = item[key]
                ? item[key][value.prop]
                : null;
            } else {
              modifiedItem[value.field] = item[key] ? item[key] : null;
            }
          }
        });
        return modifiedItem;
      });
    }

    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al obtener ${message}`, error: error.message });
  }
}

async function getByDate(model, req, res, message) {
  try {
    const fechaInicio = req.params.inicio;
    const fechaFin = req.params.fin;
    const item = await model.fin({
      createdAt: { $sgte: fechaInicio, $lte: fechaFin },
    });
    if (!item) {
      return res.status(404).json({
        message: `${message} no encontrad${message.endsWith("a") ? "a" : "o"}`,
      });
    }
    res.json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al obtener ${message}`, error: error.message });
  }
}

async function create(model, req, res, message) {
  try {
    const newItem = new model(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
    return savedItem;
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al crear ${message}`, error: error.message });
  }
}

async function update(model, req, res, message, values = []) {
  try {
    const id = req.params.id;
    const body = req.body;

    if (values.length > 0) {
      for (let value of values) {
        const exist = body.hasOwnProperty(value);
        if (!exist) {
          const item = await model.findById(id);
          if (item && item[value]) {
            await model.updateOne({ _id: id }, { $unset: { [value]: "" } });
            //console.log(`Campo ${value} eliminado con éxito.`);
          } else {
            // console.log(
            //   `El campo ${value} no existe en el documento o no se proporcionó en la solicitud.`
            // );
          }
        }
      }
    }

    const updatedItem = await model.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({
        message: `${message} no encontrad${message.endsWith("a") ? "a" : "o"}`,
      });
    }
    res.json(updatedItem);
    return updatedItem;
  } catch (error) {
    res.status(500).json({
      message: `Error al actualizar ${message}`,
      error: error.message,
    });
  }
}

async function remove(model, req, res, message) {
  try {
    const deletedItem = await model.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({
        message: `${message} no encontrad${message.endsWith("a") ? "a" : "o"}`,
      });
    }
    res.json({
      message: `${message} eliminad${
        message.endsWith("a") ? "a" : "o"
      } exitosamente`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al eliminar ${message}`, error: error.message });
  }
}

function formatDate(date) {
  // Convertir la fecha a un objeto Date
  const formattedDate = new Date(date);
  // Obtener los componentes de la fecha (día, mes, año)
  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = formattedDate.getFullYear().toString().slice(-2);
  // Formatear la fecha en formato dd-mm-yy
  return `${day}-${month}-${year}`;
}

module.exports = {
  getAll,
  getById,
  getByFilter,
  getByFilterCamp,
  getByDate,
  create,
  update,
  remove,
};
