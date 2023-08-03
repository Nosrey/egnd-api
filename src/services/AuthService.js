import ApiService from './ApiService';

const URL_API = 'https://api.egndfinance.com';

export async function apiSignIn(data) {
  return ApiService.fetchData({
    url: '/iniciar-sesion',
    method: 'post',
    data,
  });
}

export async function apiSignUp(data) {
  return ApiService.fetchData({
    url: '/crear-cuenta',
    method: 'post',
    data,
  });
}

export async function apiSignOut(data) {
  return ApiService.fetchData({
    url: '/sign-out',
    method: 'post',
    data,
  });
}

export async function apiForgotPassword(data) {
  return ApiService.fetchData({
    url: '/olvidaste-tu-contraseña',
    method: 'post',
    data,
  });
}

export async function apiResetPassword(data) {
  return ApiService.fetchData({
    url: '/reset-password',
    method: 'post',
    data,
  });
}

export const createSignUp = async (body) => {
  const { email, password, businessName, modeloNegocio, moneda } = body;

  if (!email || !password || !businessName || !modeloNegocio || !moneda) {
    throw new Error('Todos los campos son obligatorios');
  }

  try {
    const resp = await fetch(`${URL_API}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: email,
        password,
        businessName,
        businessInfo: [{ businessModel: modeloNegocio, currency: moneda }],
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.errors[0]);
    } else if (!data.success && data.errors.includes('El usuario ya existe')) {
      throw new Error('El usuario ya existe');
    }

    return data.response;
  } catch (error) {
    console.error(`Error calling ${URL_API}/api/signup: ${error.message}`);
    throw error;
  }
};

export const signIn = async (body) => {
  const { email, password } = body;

  if (!email || !password) {
    throw new Error('Todos los campos son obligatorios');
  }

  try {
    const resp = await fetch(`${URL_API}/api/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: email,
        password,
      }),
    });

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.response);
    }

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error(`Error calling ${URL_API}/api/sigin: ${error.message}`);
    throw error;
  }
};
