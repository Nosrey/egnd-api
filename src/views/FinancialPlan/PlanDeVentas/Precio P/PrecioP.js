/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { getUser } from 'services/Requests';
import { FormContainer, Tabs, Alert } from 'components/ui';
import { AÑOS } from 'constants/forms.constants';
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TablePrecio from './TablePrecio';

const { TabNav, TabList } = Tabs;

function PrecioP() {
  const [info, setInfo] = useState(null);
  const [defaultCountry, setDefaultCountry] = useState('');
  const [infoForm, setInfoForm] = useState();
  const [infoFormPrecio, setInfoFormPrecio] = useState();

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const currency = useSelector((state) => state.auth.user.currency);
  const currentState = useSelector((state) => state.auth.user);

  useEffect(() => {
    const estructura = {};
    if (info && info[0]) {
      for (let i = 0; i < info[0]?.paises.length; i++) {
        const productos = [];
        const realProds = info[0]?.productos;
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
        for (let x = 0; x < info[0]?.canales.length; x++) {
          const canal = {};
          canal.canalName = info[0]?.canales[x].name;
          canal.productos = [...productos];
          canales.push(canal);
        }
        estructura[info[0]?.paises[i].value] = [...canales];
      }
      setInfoForm(() => ({ ...estructura }));
    }
  }, [info]);

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.precioData.length !== 0) {
          const datosPrecargados = {};
          const ordererData =data.precioData.sort((a, b) => a.countryName.localeCompare(b.countryName));
          for (let i = 0; i < ordererData.length; i++) {
            datosPrecargados[ordererData[i].countryName] = ordererData[i].stats;
          }
          setInfoForm(() => ({ ...datosPrecargados }));
        }
        else {
          setInfo(data?.assumptionData)
        }
        setDefaultCountry(data?.assumptionData[0]?.paises[0]?.value);
      })
      .catch((error) => console.error(error));
  }, []);


  return (
    <div>
      {showSuccessAlert && (
        <Alert className="mb-4" type="success" showIcon>
          Los datos se guardaron satisfactoriamente.
        </Alert>
      )}
      {showErrorAlert && (
        <Alert className="mb-4" type="danger" showIcon>
          No se pudieron guardar los datos.
        </Alert>
      )}
      <div className="border-b-2 mb-8 pb-1">
        <h4>Precio (P)</h4>
        <span>Plan de ventas</span>
      </div>

      <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
        <div className="border-b-2 px-4 py-1">
          <h6>Carga de productos / servicios</h6>
        </div>
        {infoForm ? (
          <Tabs defaultValue={defaultCountry}>
            <TabList>
              {infoForm &&
                Object.keys(infoForm).map((pais, index) => (
                  <TabNav key={index} value={pais}>
                    <div className="capitalize">{pais}</div>
                  </TabNav>
                ))}
            </TabList>
            {infoForm && (
              <div className="container-countries">
                <FormContainer className="cont-countries">
                  <ContainerScrollable
                    contenido={
                      <TablePrecio
                        data={infoForm}
                        dataInputs={infoFormPrecio}
                        showAlertSuces={(boolean) =>
                          setShowSuccessAlert(boolean)
                        }
                        showAlertError={(boolean) => setShowErrorAlert(boolean)}
                        currency={currency}
                      />
                    }
                  />
                </FormContainer>
              </div>
            )}
          </Tabs>
        ) : (
          <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
            <span className="text-center cursor-default">
              Para acceder a este formulario primero debe completar el
              formulario de{' '}
              <Link
                className="text-indigo-700 underline"
                to="/assumptionventas"
              >
                Assumptions Ventas
              </Link>
              .
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrecioP;
