import axios from 'axios'

export const getUser = async (id) => {
    try {
        const response = await axios.get(`/users/:${id}`)
        return response.data
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un código de error
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        } else if (error.request) {
            // La petición fue enviada pero no se recibió respuesta
            console.log(error.request)
        } else {
            // Algo sucedió en la configuración de la petición
            console.log('Error', error.message)
        }
        return { error: error.message }
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
