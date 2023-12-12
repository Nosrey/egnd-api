/* eslint-disable no-nested-ternary */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert } from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { useMedia } from 'utils/hooks/useMedia';
import TableFinancieras from './TableFinancieras';

// const { Tr, Td, TBody } = Table;

const plazos = {
  contado: '',
  treintaDias: '',
  cuarentaycincoDias: '',
  sesentaDias: '',
  noventaDias: '',
  cveinteDias: '',
  ccincuentaDias: '',
  cochenteDias: '',
  ddiezDiaz: '',
  dcuarentaDias: '',
  dsetentaDias: '',
  trescientosDias: '',
  ttreintaDias: '',
  IVA: '',
  imponible: '',
};

const defaultState = {
  impGanancias: "",
  cobranzas: plazos,
  pagoProducto: plazos,
  pagoServicio: plazos,
  stock: '',
  inversion: plazos,
};

const tiempos = [
  { name: 'contado', label: 'Contado' },
  { name: 'treintaDias', label: '30 días' },
  { name: 'cuarentaycincoDias', label: '45 días' },
  { name: 'sesentaDias', label: '60 días' },
  { name: 'noventaDias', label: '90 días' },
  { name: 'cveinteDias', label: '120 días' },
  { name: 'ccincuentaDias', label: '150 días' },
  { name: 'cochenteDias', label: '180 días' },
  { name: 'ddiezDiaz', label: '210 días' },
  { name: 'dcuarentaDias', label: '240 días' },
  { name: 'dsetentaDias', label: '270 días' },
  { name: 'trescientosDias', label: '300 días' },
  { name: 'ttreintaDias', label: '330 días' },
  { name: 'IVA', label: 'IVA' },
  { name: 'imponible', label: 'Imponible' },
];

function AssumptionsFinancieras() {
  const media = useMedia();
  const currentState = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [messageError, setMessageError] = useState(
    'No se pudieron guardar los datos.',
  );
  const [dataFinanciera, setDataFinanciera] = useState(defaultState);
  useEffect(() => {
    getUser(currentState.id).then((d) => {
      setUserData(d);
      if (d.assumpFinancierasData[0]) {
        setDataFinanciera(d.assumpFinancierasData[0]);
      }
    });
  }, [setDataFinanciera]);

  const setFormValues = (index, campo, value) => {
    if (index !== 'stock' && index !== "impGanancias") {
      const input = tiempos[index].name;
      const state = dataFinanciera.input;
      const newData = { ...dataFinanciera[campo], [input]: value };
      let tot = 0;
      Object.keys(newData).forEach((key, index) => {
        tot += Number(newData[key]);
      });

      if (tot > 100) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowErrorAlert(true);
        setMessageError('El porcentaje supera el 100%');
        setTimeout(() => {
          setShowErrorAlert(false);
          setMessageError('No se pudieron guardar los datos.');
        }, 5000);
      } else {
        setDataFinanciera({
          ...dataFinanciera,
          [campo]: newData,
        });
      }
    } else {
      setDataFinanciera({ ...dataFinanciera, [index]: value });
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
          {messageError}
        </Alert>
      )}
      <div className="border-b-2 mb-8 pb-1">
        <h4 className="cursor-default">Assumption Gastos Financieros</h4>
        <span className="cursor-default">Gastos Financieros para Operación</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="border-b-2 px-4 py-1">
          <h6 className="cursor-default">Carga de Plazos</h6>
        </div>
        <ContainerScrollable
          contenido={
            <TableFinancieras
              setFormValues={setFormValues}
              media={media}
              dataFinanciera={dataFinanciera}
              setShowErrorAlert={setShowErrorAlert}
              setShowSuccessAlert={setShowSuccessAlert}
              tiempos={tiempos}
            />
          }
        />
      </div>
    </div>
  );
}

export default AssumptionsFinancieras;
