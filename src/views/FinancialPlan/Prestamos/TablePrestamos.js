/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { Button, FormContainer, FormItem, Input, Select } from 'components/ui';
import { mesesPrestamos } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { deletePrestamo } from 'services/Requests';
import { formatNumberPrestamos } from 'utils/formatTotalsValues';
import { v4 as uuid } from 'uuid';

function TablePrestamos(props) {
  const [showRemoveProd, setShowRemoveProd] = useState(false);
  const [seeButtons, setSeeButtons] = useState(false);
  const currency = useSelector((state) => state.auth.user.currency);

  const hableChangePrestamo = (cta, e) => {
    let bien;
    if (cta._id) {
      bien = props.data.findIndex((bien) => bien._id === cta._id);
    } else {
      bien = props.data.findIndex((bien) => bien.id === cta.id);
    }

    const copyBien = [...props.data];
    copyBien[bien].mesInicio = e.value;

    props.setPrestamos([...copyBien]);
    viewButtons();
  };

  const handleChangeInputs = (cta, e, campo) => {
    let bien;

    if (cta._id) {
      bien = props.data.findIndex((bien) => bien._id === cta._id);
    } else {
      bien = props.data.findIndex((bien) => bien.id === cta.id);
    }

    const copyBien = [...props.data];
    copyBien[bien][campo] = e.target.value;

    props.setPrestamos([...copyBien]);

    viewButtons();
  };

  const calcTasaMensual = (tasaAnu) => {
    if (Number(tasaAnu) === 0) return 0;

    return Number(tasaAnu) / 12 || 0;
  };

  const calcPagoMensual = (monto, tasaAnual, plazo) => {
    const tasaMensual = calcTasaMensual(tasaAnual) / 100;

    const firstTerm =
      Number(monto) * (tasaMensual * (1 + tasaMensual) ** Number(plazo));

    const secondTerm = (1 + tasaMensual) ** Number(plazo) - 1;

    return firstTerm / secondTerm || 0;
  };

  const calcCapInt = (monto, tasaAnual, plazo) =>
    calcPagoMensual(monto, tasaAnual, plazo) * Number(plazo) || 0;

  const calcInteresTotal = (monto, tasaAnual, plazo) =>
    calcCapInt(monto, tasaAnual, plazo) - Number(monto) || 0;

  const calcInteresMensual = (monto, tasaAnual, plazo) => {
    if (isNaN(calcInteresTotal(monto, tasaAnual, plazo) / Number(plazo))) {
      return 0;
    }
    return calcInteresTotal(monto, tasaAnual, plazo) / Number(plazo);
  };

  const calcCapitalMensual = (monto, tasaAnual, plazo) =>
    calcPagoMensual(monto, tasaAnual, plazo) -
      calcInteresMensual(monto, tasaAnual, plazo) || 0;

  const viewButtons = () => {
    let view = false;

    if (props.data.length === 1) {
      if (
        props.data[0].titulo !== '' &&
        Number(props.data[0].monto) >= 0 &&
        Number(props.data[0].plazo) >= 0 &&
        Number(props.data[0].tasaAnual) >= 0 &&
        props.data[0].mesInicio !== ''
      )
        view = true;
    }

    if (props.data.length > 1) {
      props.data.forEach((d) => {
        if (
          d.titulo !== '' &&
          Number(d.monto) >= 0 &&
          Number(d.plazo) >= 0 &&
          Number(d.tasaAnual) >= 0 &&
          d.mesInicio !== ''
        ) {
          view = true;
        } else {
          view = false;
        }
      });
    }

    setSeeButtons(view);
  };

  const removePrestamo = (cta) => {
    if (cta._id) {
      props.setPrestamos(props.data.filter((item) => cta._id !== item._id));
      deletePrestamo(cta._id).then((resp) => {
        viewButtons();
      });
    } else {
      props.setPrestamos(props.data.filter((item) => cta.id !== item.id));
    }

    if (props.data.length === 1) {
      props.setPrestamos([
        {
          idUser: localStorage.getItem('userId'),
          id: uuid(),
          titulo: '',
          monto: 0,
          plazo: 0,
          tasaAnual: 0,
          mesInicio: '',
        },
      ]);
    }

    viewButtons();
  };

  useEffect(() => {
    viewButtons();
  }, []);

  return (
    <>
      {props.data && (
        <div>
          <FormContainer>
            <section className="contenedor">
              {props.data.map((cta, index) => (
                <div className="flex  gap-x-3 ">
                  <div className="flex flex-col ">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p> Título</p>
                      </div>
                    )}

                    <FormItem
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[300px]'
                          : 'mt-[20px] w-[300px]'
                      }`}
                    >
                      <Input
                        placeholder="Ingrese un título"
                        name="titulo"
                        type="text"
                        value={cta.titulo}
                        onChange={(e) => handleChangeInputs(cta, e, 'titulo')}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col ">
                    {index === 0 && (
                      <div className="titleRow min-w-[22px]">
                        <p> Monto</p>
                      </div>
                    )}

                    <FormItem
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[180px]'
                          : 'mt-[20px] w-[180px]'
                      }`}
                    >
                      <Input
                        name="monto"
                        type="number"
                        prefix={currency}
                        value={cta.monto}
                        onChange={(e) => handleChangeInputs(cta, e, 'monto')}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Plazo</p>
                      </div>
                    )}

                    <FormItem
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input
                        name="plazo"
                        type="number"
                        value={cta.plazo}
                        onChange={(e) => handleChangeInputs(cta, e, 'plazo')}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Tasa Anual</p>
                      </div>
                    )}

                    <FormItem
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input
                        name="tasaAnual"
                        type="number"
                        suffix="%"
                        value={cta.tasaAnual}
                        onChange={(e) =>
                          handleChangeInputs(cta, e, 'tasaAnual')
                        }
                      />
                    </FormItem>
                  </div>
                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Mes inicio</p>
                      </div>
                    )}

                    <div className="inline-block flex items-center gap-4">
                      {showRemoveProd && (
                        <Button
                          shape="circle"
                          size="sm"
                          variant="twoTone"
                          color="red-600"
                          className="mb-0"
                          icon={<MdDelete />}
                          onClick={() => removePrestamo(cta)}
                        />
                      )}
                      <FormItem
                        className={`${
                          index === 0
                            ? 'mt-[40px] w-[200px] '
                            : 'mt-[20px] w-[200px]'
                        }`}
                      >
                        <Select
                          name="prestamo"
                          placeholder="Seleccione un mes"
                          options={mesesPrestamos}
                          value={mesesPrestamos.filter(
                            (option) => option.value === cta.mesInicio,
                          )}
                          onChange={(e) => hableChangePrestamo(cta, e)}
                        />
                      </FormItem>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Tasa Mensual</p>
                      </div>
                    )}

                    <FormItem
                      disabled
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input
                        name="unidad"
                        suffix="%"
                        disabled
                        value={calcTasaMensual(cta.tasaAnual)}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Pago Mensual</p>
                      </div>
                    )}

                    <FormItem
                      disabled
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input
                        name="unidad"
                        disabled
                        prefix={currency}
                        value={formatNumberPrestamos(
                          calcPagoMensual(cta.monto, cta.tasaAnual, cta.plazo),
                        )}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Capital Mensual</p>
                      </div>
                    )}

                    <FormItem
                      disabled
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input
                        name="unidad"
                        disabled
                        prefix={currency}
                        value={formatNumberPrestamos(
                          calcCapitalMensual(
                            cta.monto,
                            cta.tasaAnual,
                            cta.plazo,
                          ),
                        )}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Interés Mensual</p>
                      </div>
                    )}

                    <FormItem
                      disabled
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input
                        name="unidad"
                        disabled
                        prefix={currency}
                        value={formatNumberPrestamos(
                          calcInteresMensual(
                            cta.monto,
                            cta.tasaAnual,
                            cta.plazo,
                          ),
                        )}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Interés Total</p>
                      </div>
                    )}

                    <FormItem
                      disabled
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input
                        name="unidad"
                        disabled
                        prefix={currency}
                        value={formatNumberPrestamos(
                          calcInteresTotal(cta.monto, cta.tasaAnual, cta.plazo),
                        )}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Cap + Interes</p>
                      </div>
                    )}

                    <FormItem
                      disabled
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input
                        name="unidad"
                        disabled
                        prefix={currency}
                        value={formatNumberPrestamos(
                          calcCapInt(cta.monto, cta.tasaAnual, cta.plazo),
                        )}
                      />
                    </FormItem>
                  </div>
                </div>
              ))}
            </section>
            {seeButtons && (
              <div className="flex justify-between gap-x-2 w-[300px]">
                {props.data ? (
                  <Button
                    style={{
                      width: '47%',
                    }}
                    className=" flex justify-center items-center"
                    // variant="solid"
                    variant="twoTone"
                    // color="blue-600"
                    color="red-600"
                    onClick={() => {
                      setShowRemoveProd(!showRemoveProd);
                    }}
                  >
                    {showRemoveProd === true ? 'Anular' : 'Eliminar item'}
                  </Button>
                ) : (
                  <div
                    style={{
                      width: '47%',
                    }}
                    className=" flex justify-center items-center"
                  />
                )}

                <Button
                  style={{
                    width: '47%',
                  }}
                  className=" flex justify-center items-center"
                  // variant="solid"
                  variant="twoTone"
                  type="button"
                  onClick={() => {
                    props.addPrestamo({
                      idUser: localStorage.getItem('userId'),
                      titulo: '',
                      id: uuid(),
                      monto: 0,
                      plazo: 0,
                      tasaAnual: 0,
                      mesInicio: '',
                    });
                  }}
                >
                  Agregar item
                </Button>
              </div>
            )}
          </FormContainer>
        </div>
      )}

      <Button
        className="border mt-6b btnSubmitTable mt-[40px]"
        variant="solid"
        type="submit"
        disabled={seeButtons === false}
        onClick={props.submit}
      >
        Guardar
      </Button>
    </>
  );
}

export default TablePrestamos;
