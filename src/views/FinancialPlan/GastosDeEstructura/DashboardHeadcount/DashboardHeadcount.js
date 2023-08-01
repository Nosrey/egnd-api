/* eslint-disable react-hooks/exhaustive-deps */
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import { MenuItem, Select } from 'components/ui';

import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import GraficoDeBarraHeadcountOne from 'components/shared/dashboard/GraficoDeBarraHeadcountOne';
import GraficoDeBarraHeadcountThree from 'components/shared/dashboard/GraficoDeBarraHeadcountThree';
import GraficoDeBarraHeadcountTwo from 'components/shared/dashboard/GraficoDeBarraHeadcountTwo';
import Total from 'components/shared/dashboard/Total';
import {
  año,
  firstSem,
  month,
  oneMonth,
  periodo,
  secondSem,
  trimn,
  year,
} from 'constants/dashboard.constant';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';

function DashboardHeadcount() {
  const currentState = useSelector((state) => state.auth.user);
  const [total, setTotal] = useState(0);
  const [cantPers, setCantPers] = useState(0);
  const [typeView, setTypeView] = useState();
  const [dataHeadcount, setDataHeadcount] = useState();
  const [yearSelected, setYearSelected] = useState({
    value: 'año 1',
    label: 'Año 1',
    year: 0,
  });
  const [periodoSelected, setPeriodoSelected] = useState({
    value: '1er semestre',
    label: '1er semestre',
    month: 6,
  });

  const selectYear = (event) => {
    setYearSelected(event);
  };

  const selectPeriodo = (event) => {
    setPeriodoSelected(event);
  };

  const calcTotals = (data) => {
    let tot = 0;
    let cantPers = 0;
    Object.values(data).map((o) => {
      o.puestos.map((d) => {
        d.años.map((a, indexY) => {
          MONTHS.map((m, indexM) => {
            if (yearSelected.year || yearSelected.year === 0) {
              if (indexY === yearSelected.year) {
                if (periodoSelected.month || periodoSelected.month === 0) {
                  if (periodoSelected.month === 0) {
                    if (indexM === 0) {
                      tot += a.volMeses[MONTHS[indexM]] * d.total;
                      cantPers += a.volMeses[MONTHS[indexM]];
                    }
                    setTypeView(oneMonth);
                  }
                  if (periodoSelected.month === 4) {
                    if (indexM < 4) {
                      tot += a.volMeses[MONTHS[indexM]] * d.total;
                      cantPers += a.volMeses[MONTHS[indexM]];
                    }
                    setTypeView(trimn);
                  }
                  if (periodoSelected.month === 6) {
                    if (indexM < 6) {
                      tot += a.volMeses[MONTHS[indexM]] * d.total;
                      cantPers += a.volMeses[MONTHS[indexM]];
                    }
                    setTypeView(firstSem);
                  }
                  if (periodoSelected.month === 12) {
                    if (indexM > 5) {
                      tot += a.volMeses[MONTHS[indexM]] * d.total;
                      cantPers += a.volMeses[MONTHS[indexM]];
                    }
                    setTypeView(secondSem);
                  }
                } else {
                  tot += a.volMeses[MONTHS[indexM]] * d.total;
                  cantPers += a.volMeses[MONTHS[indexM]];
                  setTypeView(month);
                }
              }
            } else if (!yearSelected.year) {
              tot += a.volMeses[MONTHS[indexM]] * d.total;
              cantPers += a.volMeses[MONTHS[indexM]];
              setTypeView(year);
            }
          });
        });
      });
    });

    setTotal(tot);
    setCantPers(cantPers);
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.puestosPData.length !== 0) {
          setDataHeadcount(data.puestosPData[0].puestosp);
          data.puestosPData[0].puestosp.map((p) => {
            calcTotals(p);
          });
        }
      })
      .catch((error) => console.error(error));
  }, [yearSelected, periodoSelected]);
  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Dashboard de Headcount</h4>
        <span>Headcount</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="px-4 py-5">
          <div className="flex justify-end gap-[20px]">
            <Select
              className="w-[12%]"
              placeholder="Año"
              onChange={selectYear}
              options={año}
              value={yearSelected}
            />

            {yearSelected.value !== 'todo' && (
              <Select
                className="w-[12%]"
                placeholder="Periodo"
                options={periodo}
                onChange={selectPeriodo}
                value={periodoSelected}
              >
                {periodo.map((a) => (
                  <MenuItem key={a.value} value={a.value}>
                    {a.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          <div className="mt-[30px] mb-[30px] cursor-default">
            <Total title="Monto Totales" data={total} />
          </div>
          <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
            <CardNumerica
              type="default"
              title="Cantidad de Personal"
              cantidad={cantPers}
            />
            <CardNumerica
              type="default"
              title="Costo medio por Recurso"
              cantidad={total > 0 && cantPers > 0 ? total / cantPers : 0}
            />
          </div>

          <div className=" mb-[50px] flex flex-col gap-[30px] mt-[100px] ">
            <h5 className="cursor-default pl-[20px]">
              Distribución de Headcount Q por Centro de Costo
            </h5>
            {dataHeadcount && (
              <GraficoDeBarraHeadcountOne
                typeView={typeView}
                dataHeadcount={dataHeadcount}
                periodoSelected={periodoSelected}
                yearSelected={yearSelected}
              />
            )}
          </div>
          <div className="mt-[80px] mb-[50px] flex flex-col gap-[30px]">
            <h5 className="cursor-default pl-[20px]">
              Distribución del gasto en salario por Centro de Costo
            </h5>
            {dataHeadcount && (
              <GraficoDeBarraHeadcountTwo
                typeView={typeView}
                dataHeadcount={dataHeadcount}
                periodoSelected={periodoSelected}
                yearSelected={yearSelected}
              />
            )}
          </div>

          <div className="flex gap-[30px] mt-[100px]">
            <div className="w-[30%] flex flex-col gap-[30px]">
              <h5 className="cursor-default pl-[20px]">FTE</h5>
              <CardNumerica type="default" title="FTE" cantidad={12} />
            </div>
            <div className="w-[70%] flex flex-col gap-[30px] mt-[50px]">
              <h5 className="cursor-default">Evolución de Headcount</h5>
              {dataHeadcount && (
                <GraficoDeBarraHeadcountThree
                  typeView={typeView}
                  dataHeadcount={dataHeadcount}
                  periodoSelected={periodoSelected}
                  yearSelected={yearSelected}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[30px] mt-[60px]">
            <h5 className="cursor-default pl-[20px]">Evolución FTE por mes</h5>
            <GraficoDeBarra
              data={{ brasil: [] }}
              yearSelected="año 1"
              periodoSelected="1er mes"
            />
          </div>

          <div className="flex gap-[30px] mt-[100px] mb-[50px]">
            <div className="w-[50%] flex flex-col gap-[30px]">
              <h5>Gasto en personal por Centro de Costo</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div>
            {/* <div className="w-[50%] flex flex-col gap-[30px]">
              <h5>Gasto en personal por país</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeadcount;
