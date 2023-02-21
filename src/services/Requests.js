import axios from 'axios'

const idUser = '63f3d1ac6ecccfda2c07ac4a'
const URL_API = 'http://localhost:4000'

export const getUser = async () => {
    try {
        const res = await fetch(URL_API + '/api/users/' + idUser)
        const data = await res.json()
        return data.response
    } catch (error) {
        console.error('Error:', error)
        throw new Error('No se pudo obtener los datos del usuario.')
    }
}

export const signUp = async (body) => {
    try {
        const response = await axios.post(`/signup`, body)
        return response.data
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

export const createAssumpVenta = async ({
    canales,
    churns,
    paises,
    productos,
}) => {
    try {
        const response = await axios.post(`/assumpventa`, {
            canales: canales,
            churns: churns,
            paises: paises,
            productos: productos,
            idUser: idUser,
        })
        return response.data
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

export const createVolumen = async (body) => {
    try {
        const response = await axios.post(`/volumen`, {
            volumen: body,
            idUser: idUser,
        })
        return response.data
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

export const createBienes = async (body) => {
    try {
        const response = await axios.post(`/bienes`, {
            bienes: body,
            idUser: idUser,
        })
        return response.data
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

export const createCosto = async (body) => {
    try {
        const response = axios.post(`/costo`, {
            costo: body,
            idUser: idUser,
        })
        return response.data
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

export const createGastos = async (body) => {
    try {
        const response = axios.post(`/gastos`, {
            gastos: body,
            idUser: idUser,
        })
        return response.data
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

export const createPrecio = async (body) => {
    try {
        const response = axios.post(`/precio`, {
            precio: body,
            idUser: idUser,
        })
        return response.data
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

export const createPuestosq = async (body) => {
    try {
        const response = axios.post(`/Puestosq`, {
            Puestosq: body,
            idUser: idUser,
        })
        return response.data
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

export const createPuestosv = async (body) => {
    try {
        const response = axios.post(`/puestosv`, {
            puestosv: body,
            idUser: idUser,
        })
        return response.data
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
