import { AÑOS } from 'constants/forms.constants';
import store from '../store/index';

const app = store.getState();

// const ls = JSON.parse(window.localStorage.getItem('admin'));
// const auth = JSON.parse(ls.auth);

const URL_API = 'http://localhost:4000';
const idUser = app.auth.user.id && app.auth.user.id;

const compareChannelsInfo = (newChannel, oldChannel) => {
  let updatedChannel = { ...newChannel };

  // comparo los productos del canal nuevo con el canal viejo
  for (let i = 0; i < newChannel.productos.length; i++) {
    for (let j = 0; j < oldChannel.productos.length; j++) {
      if (newChannel.productos[i].id === oldChannel.productos[j].id) {
        // si tengo el mismo producto lo analizo y tomo los datos antiguos para no sobreescrcibirlos
        let copy = { ...oldChannel.productos[j] };
        copy.name = newChannel?.productos[i].name; // a la info vieja le pongo el name actual pero sigo conservando su info
        updatedChannel.productos[i] = copy;
      }
    }
  }
  return updatedChannel;
};

const compareDatas = (newCountryInfo, oldData) => {
  let foundCountry = {
    ...oldData.find((obj) => obj.countryName === newCountryInfo.countryName),
  };

  const foundStatsIds = foundCountry.stats.map((stat) => stat.uniqueId);
  const newStatsIds = newCountryInfo.stats.map((stat) => stat.uniqueId);
  const hasSameChannels =
    foundStatsIds.length === newStatsIds.length &&
    foundStatsIds.every((id) => newStatsIds.includes(id));
  let updatedNewCountryInfo = { ...newCountryInfo };

  if (hasSameChannels) {
    for (let i = 0; i < updatedNewCountryInfo.stats.length; i++) {
      updatedNewCountryInfo.stats[i] = compareChannelsInfo(
        newCountryInfo.stats[i],
        foundCountry.stats[i],
      );
    }
  } else {
    const foundStats = foundCountry.stats;
    const newStats = newCountryInfo.stats;

    // Recorro cada canal basandome en la nueva estructura
    for (let i = 0; i < newStats.length; i++) {
      // Comparandola con cada canal de la vieja
      for (let x = 0; x < foundStats.length; x++) {
        if (newStats[i].id === foundStats[x]?.id) {
          // si ya tengo este canal, analizo sus prod para ver si hay diferencias
          updatedNewCountryInfo.stats[i] = compareChannelsInfo(
            newStats[i],
            foundStats[i],
          );
        }
      }
    }
  }
  return updatedNewCountryInfo;
};

const removeEntireCountry = (oldData, countryArray, dataType) => {
  const missingCountries = [];

  for (let i = 0; i < oldData.length; i++) {
    const country = oldData[i].countryName;
    if (!countryArray.map((obj) => obj.countryName).includes(country)) {
      missingCountries.push(country);
    }
  }

  for (let i = 0; i < missingCountries.length; i++) {
    if (dataType === 'precio') deleteCountryPrecio(missingCountries[i]);
    if (dataType === 'volumen') deleteCountryVolumen(missingCountries[i]);
    if (dataType === 'costo') deleteCountryCosto(missingCountries[i]);
  }
};

const saveNewStructurePrecio = (oldData, data) => {
  if (oldData.length === 0) {
    const info = { ...data, idUser: localStorage.getItem('userId') };
    createPrecio(info);
  } else if (oldData.find((obj) => obj.countryName === data.countryName)) {
    // si existe este pais lo comparo y actualizo
    createPrecio({
      ...compareDatas(data, oldData),
      idUser: localStorage.getItem('userId'),
    });
  } else if (!oldData.find((obj) => obj.countryName === data.countryName)) {
    // si no existe este pais y lo tengo que agregar
    const info = { ...data, idUser: localStorage.getItem('userId') };
    createPrecio(info);
  }
};
const saveNewStructureVolumen = (oldData, data) => {
  if (oldData.length === 0) {
    const info = { ...data, idUser: localStorage.getItem('userId') };
    createVolumen(info);
  } else if (oldData.find((obj) => obj.countryName === data.countryName)) {
    // si existe este pais lo comparo y actualizo
    createVolumen({
      ...compareDatas(data, oldData),
      idUser: localStorage.getItem('userId'),
    });
  } else if (!oldData.find((obj) => obj.countryName === data.countryName)) {
    // si no existe este pais y lo tengo que agregar
    const info = { ...data, idUser: localStorage.getItem('userId') };
    createVolumen(info);
  }
};
const saveNewStructureCosto = (oldData, data) => {
  if (oldData.length === 0) {
    const info = { ...data, idUser: localStorage.getItem('userId') };
    createCosto(info);
  } else if (oldData.find((obj) => obj.countryName === data.countryName)) {
    // si existe este pais lo comparo y actualizo
    createCosto({
      ...compareDatas(data, oldData),
      idUser: localStorage.getItem('userId'),
    });
  } else if (!oldData.find((obj) => obj.countryName === data.countryName)) {
    // si no existe este pais y lo tengo que agregar
    const info = { ...data, idUser: localStorage.getItem('userId') };
    createCosto(info);
  }
};
export const getUser = async (id = idUser) => {
  try {
    const resp = await fetch(`${URL_API}/api/users/${id}`);
    const data = await resp.json();
    localStorage.setItem(
      'precioData',
      JSON.stringify(data.response.precioData),
    );
    localStorage.setItem(
      'volumenData',
      JSON.stringify(data.response.volumenData),
    );
    localStorage.setItem('costoData', JSON.stringify(data.response.costoData));
    return data.response;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('No se pudo obtener los datos del usuario.');
  }
};

export const editBusinessInfo = async (
  businessName,
  businessModel,
  currency,
  imagePath,
) => {
  try {
    const formData = new FormData();
    formData.append('businessName', businessName);
    formData.append(
      'businessInfo',
      JSON.stringify([{ businessModel, currency }]),
    );
    formData.append('image', imagePath);

    const response = await fetch(`${URL_API}/api/users/${idUser}`, {
      method: 'PUT',
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error('Error', error.message);
    }
    throw error;
  }
};

export const createAssumpVenta = async (body) => {
  try {
    const response = await fetch(`${URL_API}/api/assumpventa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        canales: body.channels,
        churns: body.churn,
        paises: body.countriesSort,
        productos: body.productos,
        idUser: body.currentId,
      }),
    });

    const data = await response.json();
    const bodySend = [body];
    const estructura = {};
    if (bodySend && bodySend[0]) {
      for (let i = 0; i < bodySend[0]?.countriesSort.length; i++) {
        const productos = [];
        const realProds = bodySend[0]?.productos;
        for (let x = 0; x < realProds.length; x++) {
          const prod = {};
          prod.id = realProds[x].uniqueId;
          prod.volInicial = 0;
          prod.comision = 0;
          prod.impuesto = 0;
          prod.cargos = 0;
          prod.precioInicial = 0;
          prod.tasa = 0;
          prod.name = realProds[x].name;
          prod.inicioMes = 1;
          prod.fecha = '';
          prod['años'] = [...AÑOS];
          productos.push(prod);
        }
        const canales = [];
        for (let x = 0; x < bodySend[0]?.channels.length; x++) {
          const canal = {};
          canal.canalName = bodySend[0]?.channels[x].name;
          canal.productos = [...productos];
          canal.id = bodySend[0]?.channels[x].uniqueId;
          canales.push(canal);
        }
        estructura[bodySend[0]?.countriesSort[i].value] = [...canales];
      }
      const copyData = { ...estructura };
      const countryArray = [];
      let countId = 1;
      // eslint-disable-next-line no-restricted-syntax
      for (const countryName in copyData) {
        const statsArray = copyData[countryName];
        const countryObject = { countryName, id: countId, stats: [] };

        for (let i = 0; i < statsArray.length; i++) {
          countryObject.stats.push(statsArray[i]);
        }

        countId++;
        countryArray.push(countryObject);
      }

      //  por cada pais hago el post correspondiente para modificar la estructura de las distintas tablas
      const oldPrecioData = JSON.parse(localStorage.getItem('precioData'));
      const oldVolumenData = JSON.parse(localStorage.getItem('volumenData'));
      const oldCostoData = JSON.parse(localStorage.getItem('costoData'));
      for (let i = 0; i < countryArray.length; i++) {
        let idUser = localStorage.getItem('userId');
        const { countryName, id, stats } = countryArray[i];
        const data = { countryName, id, stats, idUser };

        saveNewStructurePrecio(oldPrecioData, data);
        saveNewStructureVolumen(oldVolumenData, data);
        saveNewStructureCosto(oldCostoData, data);
      }

      removeEntireCountry(oldPrecioData, countryArray, 'precio');
      removeEntireCountry(oldVolumenData, countryArray, 'volumen');
      removeEntireCountry(oldCostoData, countryArray, 'costo');
    }

    return data;
  } catch (error) {
    console.error('Error', error.message);
    throw error;
  }
};

// export const createPrecioInAssump = async ({ countryName, stats, idUser }) => {
//   try {
//     const precioResponse = await fetch(`${URL_API}/api/precio`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         countryName,
//         stats,
//         idUser
//       }),
//     });

//     const dataPrecioResponse = await precioResponse.json();
//     return dataPrecioResponse
//   } catch (error) {
//     console.error('Error', error);
//     throw error;
//   }
// };

export const createVolumen = async ({ countryName, stats, idUser }) => {
  try {
    const response = await fetch(`${URL_API}/api/volumen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countryName,
        stats,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const deleteCountryPrecio = async (countryName) => {
  try {
    const response = await fetch(`${URL_API}/api/precio`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countryName,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};
export const deleteCountryVolumen = async (countryName) => {
  try {
    const response = await fetch(`${URL_API}/api/volumen`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countryName,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const deleteCountryCosto = async (countryName) => {
  try {
    const response = await fetch(`${URL_API}/api/costo`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countryName,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};
export const createBienes = async (body) => {
  try {
    const response = await fetch(`/bienes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bienes: body,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const createCosto = async ({ countryName, stats, idUser }) => {
  try {
    const response = await fetch(`${URL_API}/api/costo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countryName,
        stats,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const createGastos = async (body) => {
  try {
    const response = await fetch(`/gastos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gastos: body,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const createPrecio = async ({ countryName, stats, idUser }) => {
  try {
    const response = await fetch(`${URL_API}/api/precio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countryName,
        stats,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const createPuestosq = async (body) => {
  try {
    const response = await fetch(`${URL_API}/api/Puestosq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puestosq: body,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error.message);
    throw error;
  }
};

export const createPuestospxq = async (body) => {
  try {
    const response = await fetch(`${URL_API}/api/puestospxq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puestosPxQ: body,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error.message);
    throw error;
  }
};

export const createPuestosp = async (body) => {
  try {
    const response = await fetch(`${URL_API}/api/puestosp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puestosp: body,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error.message);
    throw error;
  }
};

export const createPuestosv = async (body) => {
  try {
    const response = await fetch('/puestosv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puestosv: body,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error.message);
    throw error;
  }
};

export const createAssumpFinanciera = async (
  cobranzas,
  pagoProducto,
  pagoServicio,
  stock,
  inversion,
) => {
  try {
    const response = await fetch(`${URL_API}/api/assumpfinanciera`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cobranzas,
        pagoProducto,
        pagoServicio,
        stock,
        inversion,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error.message);
    throw error;
  }
};

export const createGastosGeneral = async ({
  centroDeGastos,
  cargasSociales,
}) => {
  try {
    const response = await fetch(`${URL_API}/api/gastosgeneral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        centroDeGastos,
        cargasSociales,
        idUser,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};
