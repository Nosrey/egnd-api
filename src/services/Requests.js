const idUser = '64040284d9a91413da049e67'
const URL_API = 'http://localhost:4000'

export const getUser = async (id) => {
    try {
        const resp = await fetch(URL_API + '/api/users/' + idUser)
        const data = await resp.json()
        return data.response
    } catch (error) {
        console.error('Error:', error)
        throw new Error('No se pudo obtener los datos del usuario.')
    }
}

export const editBusinessInfo = async (
    businessName,
    businessModel,
    currency
) => {
    try {
        const response = await fetch(URL_API + '/api/users/' + idUser, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                businessName: businessName,
                businessInfo: [
                    { businessModel: businessModel, currency: currency },
                ],
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        if (error.response) {
            console.error(error.response.data)
            console.error(error.response.status)
            console.error(error.response.headers)
        } else if (error.request) {
            console.error(error.request)
        } else {
            console.error('Error', error.message)
        }
        throw error
    }
}

export const createSignUp = async (body) => {
    const { email, password, businessName, modeloNegocio, moneda } = body

    if (!email || !password || !businessName || !modeloNegocio || !moneda) {
        throw new Error('Todos los campos son obligatorios')
    }

    try {
        const resp = await fetch(`${URL_API}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mail: email,
                password: password,
                businessName: businessName,
                businessInfo: [
                    { businessModel: modeloNegocio, currency: moneda },
                ],
            }),
        })
        if (!resp.ok) {
            const error = await resp.json()
            throw new Error(error.errors[0])
        }

        const data = await resp.json()
        return data.response
    } catch (error) {
        console.error(`Error calling ${URL_API}/api/signup: ${error.message}`)
        throw error
    }
}
export const signIn = async (body) => {
    const { email, password } = body

    if (!email || !password) {
        throw new Error('Todos los campos son obligatorios')
    }

    try {
        const resp = await fetch(`${URL_API}/api/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mail: email,
                password: password,
            }),
        })

        if (!resp.ok) {
            const error = await resp.json()
            throw new Error(error.response)
        }

        const data = await resp.json()
        return data
    } catch (error) {
        console.error(`Error calling ${URL_API}/api/sigin: ${error.message}`)
        throw error
    }
}

export const createAssumpVenta = async (canales, churns, paises, productos) => {
    try {
        const response = await fetch(URL_API + '/api/assumpventa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                canales: canales,
                churns: churns,
                paises: paises,
                productos: productos,
                idUser: idUser,
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error', error.message)
        throw error
    }
}

export const createVolumen = async (body) => {
    try {
        const response = await fetch(`/volumen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                volumen: body,
                idUser: idUser,
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error', error)
        throw error
    }
}

export const createBienes = async (body) => {
    try {
        const response = await fetch(`/bienes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bienes: body,
                idUser: idUser,
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error', error)
        throw error
    }
}

export const createCosto = async (body) => {
    try {
        const response = await fetch(`/costo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                costo: body,
                idUser: idUser,
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error', error)
        throw error
    }
}

export const createGastos = async (body) => {
    try {
        const response = await fetch(`/gastos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gastos: body,
                idUser: idUser,
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error', error)
        throw error
    }
}

export const createPrecio = async (body) => {
    try {
        const response = await fetch(`/precio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                precio: body,
                idUser: idUser,
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error', error)
        throw error
    }
}

export const createPuestosq = async (body) => {
    try {
        const response = await fetch('/Puestosq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Puestosq: body,
                idUser: idUser,
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error', error.message)
        throw error
    }
}

export const createPuestosv = async (body) => {
    try {
        const response = await fetch('/puestosv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                puestosv: body,
                idUser: idUser,
            }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error', error.message)
        throw error
    }
}
