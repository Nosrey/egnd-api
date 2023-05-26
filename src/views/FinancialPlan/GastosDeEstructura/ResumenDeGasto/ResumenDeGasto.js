/* eslint-disable no-restricted-syntax */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { FormContainer,
  FormItem,
  Input,
  Tooltip,
} from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {  getUser } from 'services/Requests';
import { Cuentas } from 'constants/cuentas.constant';
import { AÑOS } from 'constants/forms.constants';
import { FiMinus, FiPlus } from 'react-icons/fi';


function ResumenDeGasto() {
  const [info, setInfo] = useState(null);
  const [puestosQ, setPuestosQ] = useState([]);
  const [infoForm, setInfoForm] = useState();
  const currentState = useSelector((state) => state.auth.user);
  const [visibleItems, setVisibleItems] = useState([0]);
    const currency = useSelector((state) => state.auth.user.currency);

  useEffect(() => {
    let estructura = {};
    if (info) {
      Object.keys(puestosQ).map((cc, index) => {
        let heads = [];
        for (let i = 0; i < Cuentas.length; i++) {
          let head = {};
          head.id = i;
          head['años'] = [...AÑOS];
          head.name = Cuentas[i];
          head.precioInicial = 0;
          head.tasa = 0;
          head.incremento = "mensual";
          heads.push(head);
          let h = {};
          h.visible = puestosQ[cc];
          h.cuentas = [...heads];

          estructura[cc] = { ...h };
        }
      });
      console.log(estructura);
      setInfoForm(() => ({ ...estructura }));
    }
  }, [info]);
  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
      if (prevItems.includes(index)) {
        // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
        return prevItems.filter((id) => id !== index);
      } // Si el elemento no está en la lista, lo agregamos para mostrarlo
      return [...prevItems, index];
    });
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.gastosGeneralData[0].centroDeGastos.length !== 0) {
          setPuestosQ(data?.gastosGeneralData[0].centroDeGastos);
          setInfo(data?.gastosGeneralData[0].centroDeGastos);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Resumen de Gasto</h4>
        <span>Gastos</span>
      </div>

      <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
        <div className="border-b-2 px-4 py-1">
          <h6>Todos los Centros de Costo</h6>
        </div>
        {infoForm ? (
          <div className="container-countries">
          <FormContainer className="cont-countries">
            <ContainerScrollable
              contenido={
                <FormContainer>
                <section className="contenedor">
                    <div>
                      <div>
                        {Object.keys(infoForm['Administración'].cuentas).map((head, index) => (
                          <div className="flex  gap-x-3 " key={head.name}>
                            <FormItem
                              className={`${
                                index === 0
                                  ? 'mt-12 w-[210px]'
                                  : 'mb-2  w-[210px]'
                              }`}
                            >
                              <Input
                                className={`${
                                  index === 0
                                    ? 'capitalize mt-10'
                                    : 'capitalize mt-5'
                                }`}
                                disabled={!infoForm["Administración"].cuentas[head].isNew}
                                type="text"
                                name="name"
                                value={infoForm["Administración"].cuentas[head].name}
                              />
                            </FormItem>
  
                            {infoForm["Administración"].cuentas[head].años.map(
                              (año, indexYear) => (
                                <div className="flex flex-col" key={indexYear}>
                                  {index === 0 && (
                                    <div className="titleRow min-w-[62px]">
                                      <p> Año {año.año}</p>
                                      <div
                                        className="iconYear"
                                        onClick={() => hideYear(indexYear)}
                                      >
                                        {visibleItems.includes(indexYear) ? (
                                          <FiMinus />
                                        ) : (
                                          <FiPlus />
                                        )}
                                      </div>
                                    </div>
                                  )}
  
                                  <div className="titleMonths gap-x-3 gap-y-1 mt-[18px] flex flex-col">
                                    {index === 0 && (
                                      <div className="titleMonths gap-x-3 flex">
                                        {visibleItems.includes(indexYear) &&
                                          año &&
                                          Object.keys(año.volMeses).map(
                                            (mes, indexMes) => (
                                              <p
                                                key={indexMes}
                                                className="month w-[90px] capitalize"
                                              >
                                                {
                                                  Object.keys(año.volMeses)[
                                                    indexMes
                                                  ]
                                                }
                                              </p>
                                            ),
                                          )}
                                        <p className="month w-[90px]">Total</p>
                                      </div>
                                    )}
                                    <div className="flex gap-x-3 gap-y-3">
                                      {visibleItems.includes(indexYear) &&
                                        año &&
                                        Object.keys(año.volMeses).map(
                                          (mes, indexMes) => (
                                            <FormItem
                                              className={`${
                                                index === 0 ? 'mb-0' : 'mb-0'
                                              }`}
                                              key={indexMes}
                                            >
                                              <Tooltip
                                                placement="top-end"
                                                title={`${mes} - año ${
                                                  indexYear + 1
                                                }`}
                                              >
                                                <Input
                                                  className="w-[90px]"
                                                  type="number"
                                                  disabled
                                                  value={
                                                    infoForm["Administración"].cuentas[head]
                                                      .años[indexYear].volMeses[
                                                      Object.keys(año.volMeses)[
                                                        indexMes
                                                      ]
                                                    ]
                                                  }
                                                  name="month"
                                                  prefix={currency}
                                                />
                                              </Tooltip>
                                            </FormItem>
                                          ),
                                        )}
                                      <FormItem className="mb-0">
                                        <Input
                                          className="w-[90px]"
                                          type="number"
                                          disabled
                                          value={
                                            infoForm["Administración"].cuentas[head]
                                              .precioInicial
                                              ? año.volTotal
                                              : 0
                                          }
                                        />
                                      </FormItem>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
              </FormContainer>
              }
            />
          </FormContainer>
        </div>
        ) : (
          <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
            <span>
              Para acceder a este formulario primero debe completar el
              formulario de Gastos.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumenDeGasto;
