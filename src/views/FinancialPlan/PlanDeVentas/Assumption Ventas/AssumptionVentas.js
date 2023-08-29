/* eslint-disable no-return-assign */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import MySpinner from 'components/shared/loaders/MySpinner';
import { Alert } from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createAssumpVenta, getUser } from 'services/Requests';
import { useMedia } from 'utils/hooks/useMedia';
import TableAssumptionVentas from './TableAssumptionVentas';

function AssumptionVentas() {
  const [showRemoveProd, setShowRemoveProd] = useState(false);
  const [showRemoveChannel, setShowRemoveChannel] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [activeButton, setActiveButton] = useState(true);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const media = useMedia();
  const [productos, setProductos] = useState([]);
  const [countries, setCountries] = useState([]);
  const currentState = useSelector((state) => state.auth.user);
  const [channels, setChannels] = useState([]);
  const [churn, setChurn] = useState([]);
  const [showLoader, setShowLoader] = useState(true);

  const addProduct = (newProduct) => {
    if (productos.length === 10) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Se llegó al límite de 10 productos');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    } else {
      setProductos([...productos, newProduct]);
      churn.forEach((ch) => {
        ch.items.push({
          prodId: newProduct.id,
          porcentajeChurn: '',
        });
      });
      channels.forEach((channel) => {
        channel.items.push({
          prodId: newProduct.id,
          volumen: '',
        });
      });
      buttonSaveStatus();
    }
  };

  const addChurn = (newChurn) => {
    setChurn([...churn, newChurn]);
  };

  const addChannel = (newChannel) => {
    if (channels.length === 5) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Se llegó al límite de 5 canales');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    } else {
      setChannels([...channels, newChannel]);
      addChurn({
        channel: newChannel.name,
        items: [],
      });
    }
  };

  useEffect(() => {
    getUser(currentState.id).then((d) => {
      if (d.assumptionData.length !== 0) {
        setProductos(d.assumptionData && d.assumptionData[0].productos);
        setCountries(() => d.assumptionData && d.assumptionData[0].paises);
        setChannels(d.assumptionData && d.assumptionData[0].canales);
        setChurn(d.assumptionData && d.assumptionData[0].churns);
      }
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    });
  }, []);

  useEffect(() => {
    if (productos?.length !== 0 && channels?.length !== 0) {
      buttonSaveStatus();
    }
  }, [productos, channels]);

  const removeProd = (id) => {
    setProductos(productos.filter((item) => id !== item.id));
    buttonSaveStatus();
    channels.forEach(
      (channel) =>
        // eslint-disable-next-line no-param-reassign
        (channel.items = channels[0].items.filter(
          (item) => item.prodId !== id,
        )),
    );

    churn.forEach(
      (ch) =>
        // eslint-disable-next-line no-param-reassign
        (ch.items = churn[0].items.filter((item) => item.prodId !== id)),
    );
  };

  const removeChannel = (channelName) => {
    setChannels([...channels.filter((item) => channelName !== item.name)]);
  };

  const handleEditProduct = (idProd, campo, value) => {
    const position = productos.findIndex((prod) => prod.id === idProd);
    const copyProd = [...productos];
    copyProd[position][campo] = value;
    setProductos(() => [...copyProd]);
    buttonSaveStatus();
  };

  const handleEditChannel = (nameChannel, campo, value, prodId) => {
    const position = channels.findIndex((c) => c.name === nameChannel);
    const copyChannels = [...channels];
    const copyChurn = [...churn];

    buttonSaveStatus();
    if (prodId) {
      const item = {
        prodId,
        volumen: value,
      };
      if (copyChannels[position].items.some((i) => i.prodId === prodId)) {
        // modifico
        const positionI = copyChannels[position].items.findIndex(
          (c) => c.prodId === prodId,
        );
        copyChannels[position].items[positionI].volumen = value;
      } else {
        // agrego nuevo
        copyChannels[position].items.push(item);
      }
    } else {
      copyChannels[position][campo] = value;
      if (campo === 'name') {
        copyChurn[position].channel = value;
        setChurn(() => [...copyChurn]);
      }
    }
    setChannels(() => [...copyChannels]);
  };

  const handleEditChurn = (nameChannel, value, prodId) => {
    const position = churn.findIndex((c) => c.channel === nameChannel);
    const copyChurn = [...churn];
    const item = {
      prodId,
      porcentajeChurn: value,
    };
    if (copyChurn[position].items.some((i) => i.prodId === prodId)) {
      // modifico
      const positionI = copyChurn[position].items.findIndex(
        (c) => c.prodId === prodId,
      );
      copyChurn[position].items[positionI].porcentajeChurn = value;
    } else {
      // agrego nuevo
      copyChurn[position].items.push(item);
    }

    setChurn(() => [...copyChurn]);
  };

  const handleKeyPressVolumen = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  };

  const handleKeyPressChurn = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
    const value = e.target.value + e.key;
    if (value > 100) {
      e.preventDefault();
    }
  };

  const buttonSaveStatus = () => {
    if (productos?.length > 0 && channels[0]?.name !== '') {
      setActiveButton(false);
    } else {
      setActiveButton(true);
    }
  };

  const validateEmptyInputs = () => {
    let isEmpty = false;

    productos.forEach((p) => {
      if (p.name === '' || p.model === '' || p.type === '') {
        isEmpty = true;
      }
    });

    channels.forEach((c) => {
      if (c.name === '' || c.sameClient === '') {
        isEmpty = true;
      }
      if (c.items.length === 0) {
        isEmpty = true;
      }
      c.items.forEach((i) => {
        if (i.volumen === '') {
          isEmpty = true;
        }
      });
    });

    churn.forEach((c) => {
      if (c.items?.length === 0) {
        isEmpty = true;
      }
      c.items.forEach((i) => {
        if (i.porcentajeChurn === '') {
          isEmpty = true;
        }
      });
    });

    if (countries.length === 0) isEmpty = true;

    return isEmpty;
  };

  const onSubmit = () => {
    const isEmpty = validateEmptyInputs();

    if (!isEmpty) {
      const countriesSort = countries.sort((a, b) =>
        a.value.localeCompare(b.value),
      );
      const currentId = currentState.id;

      const body = {
        channels,
        churn,
        countriesSort,
        currentId,
        productos,
      };

      createAssumpVenta(body)
        .then((data) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 5000);
        })
        .catch((error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setErrorMessage('No se pudieron guardar los datos.');
          setShowErrorAlert(true);
          setTimeout(() => {
            setShowErrorAlert(false);
          }, 5000);
        });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Completa los campos vacios');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    }
    setShowRemoveChannel(false);
    setShowRemoveProd(false);
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
          {errorMessage}
        </Alert>
      )}

      {showLoader ? (
        <MySpinner />
      ) : (
        <>
          <div className="border-b-2 mb-8 pb-1">
            <h4>Supuestos de Ventas</h4>
            <span>Plan de ventas</span>
          </div>
          <div className="border-solid border-2 border-#e5e7eb rounded-lg">
            <div className="border-b-2 px-4 py-1">
              <h6>Carga de productos / servicios</h6>
            </div>
            {media === 'mobile' ? (
              <ContainerScrollable
                contenido={
                  <TableAssumptionVentas
                    countries={countries}
                    setCountries={setCountries}
                    productos={productos}
                    errors={errors}
                    removeProd={removeProd}
                    removeChannel={removeChannel}
                    addProduct={addProduct}
                    addChannel={addChannel}
                    channels={channels}
                    handleEditProduct={handleEditProduct}
                    handleEditChannel={handleEditChannel}
                    handleKeyPressVolumen={handleKeyPressVolumen}
                    churn={churn}
                    handleEditChurn={handleEditChurn}
                    handleKeyPressChurn={handleKeyPressChurn}
                    onSubmit={onSubmit}
                    showAlertSuces={(boolean) => setShowSuccessAlert(boolean)}
                    showAlertError={(boolean) => setShowErrorAlert(boolean)}
                    activeButton={activeButton}
                    showRemoveProd={showRemoveProd}
                    setShowRemoveProd={setShowRemoveProd}
                    showRemoveChannel={showRemoveChannel}
                    setShowRemoveChannel={setShowRemoveChannel}
                  />
                }
              />
            ) : (
              <TableAssumptionVentas
                countries={countries}
                setCountries={setCountries}
                productos={productos}
                errors={errors}
                removeProd={removeProd}
                removeChannel={removeChannel}
                addProduct={addProduct}
                addChannel={addChannel}
                channels={channels}
                handleEditProduct={handleEditProduct}
                handleEditChannel={handleEditChannel}
                handleKeyPressVolumen={handleKeyPressVolumen}
                churn={churn}
                handleEditChurn={handleEditChurn}
                handleKeyPressChurn={handleKeyPressChurn}
                onSubmit={onSubmit}
                showAlertSuces={(boolean) => setShowSuccessAlert(boolean)}
                showAlertError={(boolean) => setShowErrorAlert(boolean)}
                activeButton={activeButton}
                showRemoveProd={showRemoveProd}
                setShowRemoveProd={setShowRemoveProd}
                showRemoveChannel={showRemoveChannel}
                setShowRemoveChannel={setShowRemoveChannel}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AssumptionVentas;
