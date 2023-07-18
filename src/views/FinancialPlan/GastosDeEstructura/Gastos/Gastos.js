/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Button, Input, Alert } from 'components/ui';
import { createGastosGeneral, getUser } from 'services/Requests';
import { useSelector } from 'react-redux';

function Gastos() {
  const currentState = useSelector((state) => state.auth.user);
  const [showWarningEmpty, setShowWarningEmpty] = useState(false);
  const [showWarningLimit, setShowWarningLimit] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);
  const [newNameCheckbox, setNewNameCheckbox] = useState('');
  const [numCreatedCheckboxes, setNumCreatedCheckboxes] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [initialValues, setInitialValues] = useState({
    centroDeGastos: {
      Administración: false,
      Operaciones: false,
      Comercial: false,
      Marketing: false,
      PandD: false,
    },
    cargasSociales: 0,
  });

  useEffect(() => {
    if (currentState.id) {
      getUser(currentState.id)
        .then((data) => {
          if (data?.gastosGeneralData.length !== 0) {
            setInitialValues(data?.gastosGeneralData[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const validarCheckbox = (objeto) => {
    const claves = Object.keys(objeto);
    for (let i = 0; i < claves.length; i++) {
      if (objeto[claves[i]]) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    if (Object.keys(initialValues.centroDeGastos).length === 8)
      setInputDisabled(true);
  }, [numCreatedCheckboxes]);

  const handleCheckboxChange = (checkbox, checked) => {
    setInitialValues({
      ...initialValues,
      centroDeGastos: {
        ...initialValues.centroDeGastos,
        [checkbox]: checked,
      },
    });
  };

  const handleInputNumberChange = (value) => {
    setInitialValues({
      ...initialValues,
      cargasSociales: parseInt(value, 10),
    });
  };

  const handleCreateCheckbox = (e) => {
    e.preventDefault();
    if (Object.keys(initialValues.centroDeGastos).length < 8) {
      if (newNameCheckbox.trim() !== '') {
        setInitialValues({
          ...initialValues,
          centroDeGastos: {
            ...initialValues.centroDeGastos,
            [newNameCheckbox]: false,
          },
        });
        setNewNameCheckbox('');
        setNumCreatedCheckboxes(numCreatedCheckboxes + 1);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowWarningEmpty(true);
        setTimeout(() => {
          setShowWarningEmpty(false);
        }, 5000);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShowWarningLimit(true);
      setTimeout(() => {
        setShowWarningLimit(false);
      }, 5000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarCheckbox(initialValues.centroDeGastos)) {
      const id = localStorage.getItem('userId');
      const data = { ...initialValues, id };
      createGastosGeneral(data)
        .then((data) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowErrorAlert(true);
          setTimeout(() => {
            setShowErrorAlert(false);
          }, 5000);
        });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShowEmptyAlert(true);
      setTimeout(() => {
        setShowEmptyAlert(false);
      }, 5000);
    }
  };

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
      {showEmptyAlert && (
        <Alert className="mb-4" type="danger" showIcon>
          Por lo menos tienes que seleccionar un checkbox.
        </Alert>
      )}
      {showWarningEmpty && (
        <Alert className="mb-4" showIcon>
          No se puede crear un nuevo centro de costos sin nombre.
        </Alert>
      )}
      {showWarningLimit && (
        <Alert className="mb-4" showIcon>
          No se pueden crear más de tres centros de costos.
        </Alert>
      )}
      <div className="border-b-2 mb-8 pb-1">
        <h4>Supuesto de Gasto de Estructura</h4>
        <span>Gastos de Estructura</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="border-b-2 px-4 py-1">
          <h6>Seleccione sus Centros de Costos</h6>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex">
            <div className="w-1/2 flex flex-col justify-center gap-y-2.5 pr-8">
              {Object.keys(initialValues.centroDeGastos).map(
                (checkbox, index) => (
                  <div className="flex items-center gap-x-2">
                    <input
                      className="border border-opacity-100 border-gray-300 rounded-sm shadow-sm shadow-colored cursor-pointer h-5 w-5"
                      type="checkbox"
                      key={index}
                      id={index}
                      name={checkbox}
                      checked={initialValues.centroDeGastos[checkbox]}
                      onChange={(e) =>
                        handleCheckboxChange(checkbox, e.target.checked)
                      }
                    />
                    <label htmlFor={checkbox}>
                      {checkbox === 'PandD'
                        ? 'P & D'
                        : checkbox.charAt(0).toUpperCase() + checkbox.slice(1)}
                    </label>
                  </div>
                ),
              )}

              <p className=" pt-7">Crear nuevo CC :</p>
              <div className="flex items-center gap-x-4 ">
                <Input
                  size="sm"
                  placeholder="Nombre"
                  type="string"
                  onChange={(e) => setNewNameCheckbox(e.target.value)}
                  value={newNameCheckbox}
                  disabled={inputDisabled}
                />
                <Button onClick={handleCreateCheckbox} variant="twoTone">
                  Crear
                </Button>
              </div>
            </div>
            <div className="w-1/2 pl-8">
              <div className="flex flex-col gap-y-3">
                <span>Incremento cargas sociales</span>
                <div className="w-[30%]">
                  <Input
                    type="number"
                    value={initialValues.cargasSociales}
                    suffix="%"
                    onChange={(e) => handleInputNumberChange(e.target.value)}
                  />
                </div>
                <span>
                  *Es el aumento sobre el sueldo en concepto de cargas sociales
                  para determinar el costo empresa de cada recurso
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end pt-6">
            <Button variant="solid">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Gastos;
