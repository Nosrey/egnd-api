import React, { useEffect, useState } from 'react'
import { getUser } from 'services/Requests'
import { Tabs, Input } from 'components/ui'

const { TabNav, TabList, TabContent } = Tabs

function VolumenQ() {
    const [info, setInfo] = useState(null)
    const [defaultCountry, setDefaultCountry] = useState(null)
    useEffect(() => {
        getUser()
            .then((data) => {
                console.log(data)
                setInfo(data?.assumptionData)
                setDefaultCountry(data?.assumptionData[0]?.paises[0])
            })
            .catch((error) => console.error(error))
    }, [])
    console.log(info)
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

                <Tabs defaultValue={defaultCountry}>
                    <TabList>
                        {info &&
                            info[0]?.paises.map((tab, index) => (
                                <TabNav key={index} value={tab.value}>
                                    <div>{tab.label}</div>
                                </TabNav>
                            ))}
                    </TabList>
                    <div className="p-4">
                        {info &&
                            info[0]?.paises.map((tab) => (
                                <TabContent value={tab.value} key={tab.value}>
                                    {info[0]?.canales.map((channel, index) => (
                                        <div key={index}>
                                            <div>{channel.name}</div>
                                        </div>
                                    ))}
                                </TabContent>
                            ))}
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

export default VolumenQ
