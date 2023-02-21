import React, { useEffect } from 'react'
import { getUser } from 'services/Requests'

function VolumenQ() {
    useEffect(() => {
        getUser()
            .then((data) => console.log(data))
            .catch((error) => console.error(error))
    }, [])

    return (
        <div>
            <div className="border-b-2 mb-8 pb-1">
                <h4>Volumen (Q)</h4>
                <span>Plan de ventas</span>
            </div>
            <div className="border-solid border-2 border-#e5e7eb rounded-lg">
                <div className="border-b-2 px-4 py-1">
                    <h6>Carga de productos / servicios</h6>
                </div>

                <div className="px-4 py-5">Hola mundo!</div>
            </div>
        </div>
    )
}

export default VolumenQ
