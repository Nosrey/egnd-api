import { AÑOS } from 'constants/forms.constants'
import store from '../store/index';


const app = store.getState();

// const ls = JSON.parse(window.localStorage.getItem('admin'));
// const auth = JSON.parse(ls.auth);

const URL_API = 'http://localhost:4000';
const idUser = app.auth.user.id && app.auth.user.id;

export const getUser = async (id = idUser) => {
  try {
    console.log('[ID]', id, app);
    const resp = await fetch(`${URL_API}/api/users/${id}`);
    const data = await resp.json();
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
    const bodySend = [body]

    const estructura = {};
    if (bodySend && bodySend[0]) {
      for (let i = 0; i < bodySend[0]?.countriesSort.length; i++) {
        const productos = [];
        const realProds = bodySend[0]?.productos;
        for (let x = 0; x < realProds.length; x++) {
          const prod = {};
          prod.id = realProds[x].id;
          prod.volInicial = 0;
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
          canales.push(canal);
        }
        estructura[bodySend[0]?.countriesSort[i].value] = [...canales];
      }
      const copyData = { ...estructura };
      const countryArray = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const countryName in copyData) {
        const statsArray = copyData[countryName];
        const countryObject = { countryName, stats: [] };

        for (let i = 0; i < statsArray.length; i++) {
          countryObject.stats.push(statsArray[i]);
        }

        countryArray.push(countryObject);
      }

      for (let i = 0; i < countryArray.length; i++) {
        let idUser = localStorage.getItem('userId')
        const { countryName, stats } = countryArray[i];
        const data = { countryName, stats, idUser };
        createPrecio(data);
      }

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


export const createVolumen = async ({ countryName, stats }) => {
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

export const createCosto = async ({ countryName, stats }) => {
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
    const response = await fetch('/Puestosq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Puestosq: body,
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
