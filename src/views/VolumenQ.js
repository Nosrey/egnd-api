import React, { useEffect } from 'react'
import { getUser } from 'services/Requests'
import { Tabs } from 'components/ui'

const { TabNav, TabList, TabContent } = Tabs

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

                <Tabs defaultValue="tab1" variant="pill">
                    <TabList>
                        <TabNav value="tab1">Home</TabNav>
                        <TabNav value="tab2">Profile</TabNav>
                        <TabNav value="tab3">Contact</TabNav>
                    </TabList>
                    <div className="p-4">
                        <TabContent value="tab1">
                            <p>
                                If builders built buildings the way programmers
                                wrote programs, then the first woodpecker that
                                came along would destroy civilization. (Gerald
                                Weinberg)
                            </p>
                        </TabContent>
                        <TabContent value="tab2">
                            <p>
                                A computer lets you make more mistakes faster
                                than any invention in human history–with the
                                possible exceptions of handguns and tequila.
                                (Mitch Radcliffe).
                            </p>
                        </TabContent>
                        <TabContent value="tab3">
                            <p>
                                In C++ it’s harder to shoot yourself in the
                                foot, but when you do, you blow off your whole
                                leg. (Bjarne Stroustrup)
                            </p>
                        </TabContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

export default VolumenQ
