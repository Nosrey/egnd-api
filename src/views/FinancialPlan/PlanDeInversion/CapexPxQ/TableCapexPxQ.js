/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { FormContainer, FormItem, Input, Tooltip } from 'components/ui';
import { AÑOS, MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';

function TableCapexPxQ(props) {
  const [capexP, setCapexP] = useState();
  const [capexQ, setCapexQ] = useState();
  const [visibleItems, setVisibleItems] = useState([0]);
  const currency = useSelector((state) => state.auth.user.currency);

  useEffect(() => {
    if (props.capexP) setCapexP(props.capexP);
    if (props.capexQ) setCapexQ(props.capexQ);
  }, [props]);

  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
      if (prevItems.includes(index)) {
        // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
        return prevItems.filter((id) => id !== index);
      } // Si el elemento no está en la lista, lo agregamos para mostrarlo
      return [...prevItems, index];
    });
  };
  const calcTotals = () => {
    let total = [];
    if (capexP) {
      capexP.map((d, index) => {
        for (let i = 0; i <= 9; i++) {
          if (!total[i]) {
            total.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          }
          for (let j = 0; j <= 11; j++) {
            total[i][j] +=
              Number(d.años[i].volMeses[MONTHS[j]]) *
              (Number(capexQ[index].años[i].volMeses[MONTHS[j]]) || 0);
          }
        }
      });

      return total;
    }
  };
  const calcHor = () => {
    let tot = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (capexP && capexQ) {
      capexP.map((d, index) => {
        for (let i = 0; i <= 9; i++) {
          for (let j = 0; j <= 11; j++) {
            tot[i] +=
              Number(d.años[i].volMeses[MONTHS[j]]) *
              (Number(capexQ[index].años[i].volMeses[MONTHS[j]]) || 0);
          }
        }
      });
    }

    return tot;
  };

  const calcTotal = () => {
    let tot = 0;
    if (totals) {
      totals.map((t, index) => {
        tot += totals[index].reduce(
          (acumulador, numero) => acumulador + numero,
          0,
        );
      });

      return tot;
    }
  };

  const totals = calcTotals();
  const tot = calcTotal();

  return (
    <>
      {capexP && (
        <FormContainer>
          {capexP && (
            <section className="contenedor">
              {capexP.map((cta, index) => (
                <div className="flex  gap-x-3 " key={cta.name}>
                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Bien</p>
                      </div>
                    )}
                    <FormItem
                      className={`${
                        index === 0 ? 'w-[210px]' : 'mb-2  w-[210px]'
                      }`}
                    >
                      <Input
                        className={`${
                          index === 0 ? 'capitalize mt-10' : 'capitalize mt-5'
                        }`}
                        disabled
                        type="text"
                        name="name"
                        value={cta.bien}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Descripción</p>
                      </div>
                    )}
                    <FormItem
                      className={`${
                        index === 0 ? 'w-[210px]' : 'mb-2  w-[210px]'
                      }`}
                    >
                      <Input
                        className={`${
                          index === 0 ? 'capitalize mt-10' : 'capitalize mt-5'
                        }`}
                        disabled
                        type="text"
                        name="name"
                        value={cta.descripcion}
                      />
                    </FormItem>
                  </div>

                  {cta.años.map((año, indexYear) => (
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
                              Object.keys(año.volMeses).map((mes, indexMes) => (
                                <p
                                  key={indexMes}
                                  className="month w-[90px] capitalize"
                                >
                                  {Object.keys(año.volMeses)[indexMes]}
                                </p>
                              ))}
                            <p className="month w-[90px]">Total</p>
                          </div>
                        )}
                        <div className="flex gap-x-3 gap-y-3">
                          {visibleItems.includes(indexYear) &&
                            año &&
                            Object.keys(año.volMeses).map((mes, indexMes) => (
                              <FormItem
                                className={`${index === 0 ? 'mb-0' : 'mb-0'}`}
                                key={indexMes}
                              >
                                <Tooltip
                                  placement="top-end"
                                  title={`$${
                                    cta.años[indexYear].volMeses[
                                      Object.keys(año.volMeses)[indexMes]
                                    ] *
                                    (Number(
                                      capexQ[index].años[indexYear].volMeses[
                                        Object.keys(año.volMeses)[indexMes]
                                      ],
                                    ) || 0)
                                  }`}
                                >
                                  <Input
                                    className="w-[90px]"
                                    type="number"
                                    disabled
                                    value={
                                      cta.años[indexYear].volMeses[
                                        Object.keys(año.volMeses)[indexMes]
                                      ] *
                                      (Number(
                                        capexQ[index].años[indexYear].volMeses[
                                          Object.keys(año.volMeses)[indexMes]
                                        ],
                                      ) || 0)
                                    }
                                    name="month"
                                    prefix={currency}
                                  />
                                </Tooltip>
                              </FormItem>
                            ))}
                          <FormItem className="mb-0">
                            <Input
                              className="w-[90px]"
                              type="number"
                              value={totHor[indexYear]}
                              disabled
                              prefix={currency}
                            />
                          </FormItem>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          )}
        </FormContainer>
      )}

      {capexP && (
        <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]">
          <div className="flex items-center">
            <p className=" text-[#707470] font-bold mb-3 text-left w-[500px] ">
              Inversion neta (alta)
            </p>
          </div>
          <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
            {capexP.length > 0 && (
              <div className="flex gap-x-3 w-fit pt-3 ml-[420px] ">
                {AÑOS.map((año, indexYear) => (
                  <div className="flex flex-col" key={indexYear}>
                    <div className="titleRowR min-w-[62px]">
                      <p> Año {indexYear + 1}</p>
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
                    <div className="titleMonths gap-x-3 flex mb-3">
                      {visibleItems.includes(indexYear) &&
                        año &&
                        MONTHS.map((mes, indexMes) => (
                          <p
                            key={indexMes}
                            className="month w-[90px] capitalize"
                          >
                            {mes}
                          </p>
                        ))}
                      <p className="month w-[90px]">Total</p>
                    </div>
                    <div className="flex gap-x-3 gap-y-3">
                      {visibleItems.includes(indexYear) &&
                        año &&
                        props.capexP.length !== 0 &&
                        MONTHS.map((valor, index) => (
                          <p className="w-[90px] text-center">
                            {currency}
                            {totals[indexYear][index]}
                          </p>
                        ))}
                      <p className="w-[90px] text-center font-bold">

                        {/* {currency} */}

                        {indexYear === 0 && currency}

                        {totals[indexYear].reduce(
                          (acumulador, numero) => acumulador + numero,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className=" pl-[45px] text-[#707470]  mb-3 text-left w-[500px] ">
            TOTAL: {currency}
            {tot}
          </p>
        </div>
      )}
    </>
  );
}

export default TableCapexPxQ;
