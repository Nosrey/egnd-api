import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarraCosto from 'components/shared/dashboard/GraficoDeBarraCosto';
import Total from 'components/shared/dashboard/Total';
import { MenuItem, Select } from 'components/ui';
import {
  año,
  firstSem,
  oneMonth,
  periodo,
  secondSem,
  trimn,
  year,
} from 'constants/dashboard.constant';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useMedia } from 'utils/hooks/useMedia';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { resolveResul } from 'services/TotalProductsService';
import MySpinner from 'components/shared/loaders/MySpinner';

function DashboardCostos() {
  const media = useMedia();

  const [totalCostos, setTotalCostos] = useState(0);
  const [totalProd, setTotalProd] = useState(0);
  const [volProd, setVolProd] = useState(0);
  const [typeViewGraf, setTypeViewGraf] = useState();
  const [volGrafico, setVolGrafico] = useState(0);
  const [comisionGrafico, setComisionGrafico] = useState(0);
  const [impuestoGrafico, setImpuestoGrafico] = useState(0);
  const [cargasGrafico, setCargasGrafico] = useState(0);
  const [canalesOptions, setCanalesOptions] = useState();
  const [paisesOptions, setPaisesOptions] = useState();
  const [productosOptions, setProductosOptions] = useState();
  const [canalSelected, setCanalSelected] = useState();
  const [paisSelected, setPaisSelected] = useState();
  const [productoSelected, setProductoSelected] = useState();
  const [volServ, setVolServ] = useState(0);
  const [dataAssump, setDataAssump] = useState();
  const [totalServ, setTotalServ] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const currentState = useSelector((state) => state.auth.user);
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

  const selecOptions = (option, value) => {
    switch (option) {
      case 'pais':
        setPaisSelected(value);
        break;
      case 'canal':
        setCanalSelected(value);
        break;

      case 'producto':
        setProductoSelected(value);
        break;

      default:
        break;
    }
  };

  const calcCostos = (precio, volumen, comision, impuesto, cargos, costo) => {
    let tot = 0;
    tot +=
      resolveResul(precio, volumen, comision) +
      resolveResul(precio, volumen, impuesto) +
      resolveResul(precio, volumen, cargos) +
      parseInt(volumen * costo);

    return tot;
  };

  const calcVols = (dataVolumen) => {
    let totV = 0;
    let totS = 0;
    dataVolumen.map((d) => {
      d.stats.map((s) => {
        s.productos.map((p, indexP) => {
          p.años.map((a, indexY) => {
            if (yearSelected.year || yearSelected.year === 0) {
              if (yearSelected.year === indexY) {
                MONTHS.map((m, indexM) => {
                  if (periodoSelected.month || periodoSelected.month === 0) {
                    if (periodoSelected.month === 0) {
                      if (indexM === 0) {
                        if (dataAssump.productos[indexP].type === 'producto') {
                          totV += Number(a.volMeses[MONTHS[indexM]]);
                        } else {
                          totS += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    } else if (periodoSelected.month === 4) {
                      if (indexM < 3) {
                        if (dataAssump.productos[indexP].type === 'producto') {
                          totV += Number(a.volMeses[MONTHS[indexM]]);
                        } else {
                          totS += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    } else if (periodoSelected.month === 6) {
                      if (indexM < 6) {
                        if (dataAssump.productos[indexP].type === 'producto') {
                          totV += Number(a.volMeses[MONTHS[indexM]]);
                        } else {
                          totS += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    } else if (periodoSelected.month === 12) {
                      if (indexM > 5) {
                        if (dataAssump.productos[indexP].type === 'producto') {
                          totV += Number(a.volMeses[MONTHS[indexM]]);
                        } else {
                          totS += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    }
                  } else if (dataAssump.productos[indexP].type === 'producto') {
                    totV += Number(a.volTotal);
                  } else {
                    totS += Number(a.volTotal);
                  }
                });
              }
            } else if (dataAssump.productos[indexP].type === 'producto') {
              totV += Number(a.volTotal);
            } else {
              totS += Number(a.volTotal);
            }
          });
        });
      });
    });

    setVolProd(totV);
    setVolServ(totS);
  };

  const calcTotals = (volumenData, costoData, precioData) => {
    let tot = 0;
    let totProd = 0;
    let totServ = 0;
    let volGraf = [0];
    let comisionGraf = [0];
    let impuestoGraf = [0];
    let cargoGraf = [0];
    let volGrafTrim = [0, 0, 0, 0];
    let comisionGrafTrim = [0, 0, 0, 0];
    let impuestoGrafTrim = [0, 0, 0, 0];
    let cargoGrafTrim = [0, 0, 0, 0];
    let volGrafSem = [0, 0, 0, 0, 0, 0];
    let comisionGrafSem = [0, 0, 0, 0, 0, 0];
    let impuestoGrafSem = [0, 0, 0, 0, 0, 0];
    let cargoGrafSem = [0, 0, 0, 0, 0, 0];
    let volGrafYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let comisionGrafYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let impuestoGrafYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let cargoGrafYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    Object.values(precioData).map((d, indexInicial) => {
      d.stats.map((s, indexStats) => {
        s.productos.map((p, indexP) => {
          p.años.map((a, indexYear) => {
            MONTHS.map((m, indexM) => {
              if (yearSelected.year || yearSelected.year === 0) {
                if (yearSelected.year === indexYear) {
                  if (periodoSelected.month || periodoSelected.month === 0) {
                    if (periodoSelected.month === 0) {
                      if (indexM === 0) {
                        if (canalSelected && productoSelected && paisSelected) {
                          if (
                            d.countryName === paisSelected.value &&
                            s.canalName === canalSelected.value &&
                            p.name === productoSelected.value
                          ) {
                            volGraf[indexM] +=
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m] *
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m];

                            comisionGraf[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].comision,
                            );

                            impuestoGraf[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].impuesto,
                            );

                            cargoGraf[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].cargos,
                            );
                            setVolGrafico(volGraf);
                            setComisionGrafico(comisionGraf);
                            setImpuestoGrafico(impuestoGraf);
                            setCargasGrafico(cargoGraf);
                            setTypeViewGraf(oneMonth);
                          }
                        }
                        if (dataAssump.productos[indexP].type === 'producto') {
                          totProd += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        } else {
                          totServ += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        }
                        tot += calcCostos(
                          a.volMeses[m],
                          volumenData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].comision,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].impuesto,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].cargos,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                        );
                      }
                    } else if (periodoSelected.month === 4) {
                      if (indexM < 3) {
                        if (canalSelected && productoSelected && paisSelected) {
                          if (
                            d.countryName === paisSelected.value &&
                            s.canalName === canalSelected.value &&
                            p.name === productoSelected.value
                          ) {
                            volGrafTrim[indexM] +=
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m] *
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m];

                            comisionGrafTrim[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].comision,
                            );

                            impuestoGrafTrim[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].impuesto,
                            );

                            cargoGrafTrim[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].cargos,
                            );
                            setVolGrafico(volGrafTrim);
                            setComisionGrafico(comisionGrafTrim);
                            setImpuestoGrafico(impuestoGrafTrim);
                            setCargasGrafico(cargoGrafTrim);
                            setTypeViewGraf(trimn);
                          }
                        }
                        if (dataAssump.productos[indexP].type === 'producto') {
                          totProd += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        } else {
                          totServ += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        }
                        tot += calcCostos(
                          a.volMeses[m],
                          volumenData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].comision,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].impuesto,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].cargos,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                        );
                      }
                    } else if (periodoSelected.month === 6) {
                      if (indexM < 6) {
                        if (canalSelected && productoSelected && paisSelected) {
                          if (
                            d.countryName === paisSelected.value &&
                            s.canalName === canalSelected.value &&
                            p.name === productoSelected.value
                          ) {
                            volGrafSem[indexM] +=
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m] *
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m];

                            comisionGrafSem[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].comision,
                            );

                            impuestoGrafSem[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].impuesto,
                            );

                            cargoGrafSem[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].cargos,
                            );
                            setVolGrafico(volGrafSem);
                            setComisionGrafico(comisionGrafSem);
                            setImpuestoGrafico(impuestoGrafSem);
                            setCargasGrafico(cargoGrafSem);
                            setTypeViewGraf(firstSem);
                          }
                        }
                        if (dataAssump.productos[indexP].type === 'producto') {
                          totProd += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        } else {
                          totServ += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        }
                        tot += calcCostos(
                          a.volMeses[m],
                          volumenData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].comision,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].impuesto,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].cargos,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                        );
                      }
                    } else if (periodoSelected.month === 12) {
                      if (indexM > 5) {
                        if (canalSelected && productoSelected && paisSelected) {
                          if (
                            d.countryName === paisSelected.value &&
                            s.canalName === canalSelected.value &&
                            p.name === productoSelected.value
                          ) {
                            volGrafSem[indexM] +=
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m] *
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m];

                            comisionGrafSem[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].comision,
                            );

                            impuestoGrafSem[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].impuesto,
                            );

                            cargoGrafSem[indexM] += resolveResul(
                              a.volMeses[m],
                              volumenData[indexInicial].stats[indexStats]
                                .productos[indexP].años[indexYear].volMeses[m],
                              costoData[indexInicial].stats[indexStats]
                                .productos[indexP].cargos,
                            );
                            setVolGrafico(volGrafSem);
                            setComisionGrafico(comisionGrafSem);
                            setImpuestoGrafico(impuestoGrafSem);
                            setCargasGrafico(cargoGrafSem);
                            setTypeViewGraf(secondSem);
                          }
                        }
                        if (dataAssump.productos[indexP].type === 'producto') {
                          totProd += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        } else {
                          totServ += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        }
                        tot += calcCostos(
                          a.volMeses[m],
                          volumenData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].comision,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].impuesto,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].cargos,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                        );
                      }
                    }
                  }
                }
              } else {
                if (canalSelected && productoSelected && paisSelected) {
                  if (
                    d.countryName === paisSelected.value &&
                    s.canalName === canalSelected.value &&
                    p.name === productoSelected.value
                  ) {
                    volGrafYear[indexYear] +=
                      volumenData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].años[indexYear].volMeses[m] *
                      costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].años[indexYear].volMeses[m];

                    comisionGrafYear[indexYear] += resolveResul(
                      a.volMeses[m],
                      volumenData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].años[indexYear].volMeses[m],
                      costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].comision,
                    );

                    impuestoGrafYear[indexYear] += resolveResul(
                      a.volMeses[m],
                      volumenData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].años[indexYear].volMeses[m],
                      costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].impuesto,
                    );

                    cargoGrafYear[indexYear] += resolveResul(
                      a.volMeses[m],
                      volumenData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].años[indexYear].volMeses[m],
                      costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].cargos,
                    );
                    setVolGrafico(volGrafYear);
                    setComisionGrafico(comisionGrafYear);
                    setImpuestoGrafico(impuestoGrafYear);
                    setCargasGrafico(cargoGrafYear);
                    setTypeViewGraf(year);
                  }
                }
                if (dataAssump.productos[indexP].type === 'producto') {
                  totProd += calcCostos(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .comision,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .impuesto,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .cargos,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .años[indexYear].volMeses[m],
                  );
                } else {
                  totServ += calcCostos(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .comision,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .impuesto,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .cargos,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .años[indexYear].volMeses[m],
                  );
                }
                tot += calcCostos(
                  a.volMeses[m],
                  volumenData[indexInicial].stats[indexStats].productos[indexP]
                    .años[indexYear].volMeses[m],
                  costoData[indexInicial].stats[indexStats].productos[indexP]
                    .comision,
                  costoData[indexInicial].stats[indexStats].productos[indexP]
                    .impuesto,
                  costoData[indexInicial].stats[indexStats].productos[indexP]
                    .cargos,
                  costoData[indexInicial].stats[indexStats].productos[indexP]
                    .años[indexYear].volMeses[m],
                );
              }
            });
          });
        });
      });
    });

    setTotalCostos(tot);
    setTotalProd(totProd);
    setTotalServ(totServ);
  };

  const createSelects = () => {
    let paises = [];
    let canales = [];
    let productos = [];

    if (!dataAssump) {
      setYearSelected({
        value: 'año 1',
        label: 'Año 1',
        year: 0,
      });

      setPeriodoSelected({
        value: '1er semestre',
        label: '1er semestre',
        month: 6,
      });
    }

    if (dataAssump) {
      dataAssump.paises.map((p, indexP) => {
        let c = {};
        c.label = p.label.toUpperCase();
        c.value = p.value;
        c.index = indexP;

        paises.push(c);
      });

      dataAssump.canales.map((d, indexC) => {
        let p = {};
        p.label = d.name.toUpperCase();
        p.value = d.name;
        p.index = indexC;

        canales.push(p);
      });

      dataAssump.productos.map((o, indexO) => {
        let m = {};
        m.label = o.name.toUpperCase();
        m.value = o.name;
        m.index = indexO;

        productos.push(m);
      });

      setProductosOptions(productos);
      setCanalesOptions(canales);
      setPaisesOptions(paises);
    }
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.assumptionData[0]) {
          setDataAssump(data?.assumptionData[0]);
          createSelects();
        }
        if (
          data?.volumenData.length !== 0 &&
          data?.costoData.length !== 0 &&
          data?.precioData.length !== 0
        ) {
          calcTotals(data?.volumenData, data?.costoData, data?.precioData);
          calcVols(data?.volumenData);
        }
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, [
    yearSelected,
    periodoSelected,
    paisSelected,
    canalSelected,
    productoSelected,
  ]);

  return (
    <>
    {showLoader ? (
        <MySpinner />
      ) : (
        <>
        <div>
          <div className="border-b-2 mb-8 pb-1">
            <h4 className="cursor-default">Dashboard de Costos</h4>
            <span className="cursor-default">Costos directos</span>
          </div>
          <div className="border-solid border-2 border-#e5e7eb rounded-lg">
            <div className="px-4 py-5">
              <div className="flex justify-end gap-[20px]">
                <Select
                  className="w-[12%] min-w-[115px]"
                  placeholder="Año"
                  onChange={selectYear}
                  options={año}
                  value={yearSelected}
                />

                {yearSelected.value !== 'todo' && (
                  <Select
                    className="w-[12%] min-w-[115px]"
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
                <Total title="Costos Totales" data={totalCostos} />
              </div>
              <div className={` ${media === "mobile" ? " flex flex-col gap-y-4" : "grid grid-cols-3 gap-[20px]"} mt-[20px]`}>
                <CardNumerica
                  type="default"
                  hasCurrency
                  title="Costo total productos"
                  cantidad={totalProd}
                />
                <CardNumerica
                  type="default"
                  title="Volumen de productos"
                  cantidad={volProd}
                />
                <CardNumerica
                  type="default"
                  hasCurrency
                  title="Costo medio por producto"
                  cantidad={volProd ? totalProd / volProd : 0}
                />
                <CardNumerica
                  type="default"
                  hasCurrency
                  title="Costo de servicios"
                  cantidad={totalServ}
                />
                <CardNumerica
                  type="default"
                  title="Volumen de servicios"
                  cantidad={volServ}
                />
                <CardNumerica
                  type="default"
                  title="Costo medio por servicio"
                  hasCurrency
                  cantidad={volServ ? totalServ / volServ : 0}
                />
              </div>
              <div className={`flex ${media === "mobile" ? " flex-col mt-[30px]  pl-[10px] gap-y-3.5" : "justify-between items-center mt-[100px]  pl-[20px]"} ` }  >
                <h5 className="cursor-default">
                  Representación de Costos sobre Ventas
                </h5>
                <div className="flex gap-[20px]">
                  <Select
                    className="w-[100%]"
                    placeholder="Producto"
                    options={productosOptions}
                    onChange={(e) => selecOptions('producto', e)}
                  />

                  <Select
                    className="w-[100%]"
                    placeholder="Canal"
                    options={canalesOptions}
                    onChange={(e) => selecOptions('canal', e)}
                  />
                  <Select
                    className="w-[100%]"
                    placeholder="País"
                    options={paisesOptions}
                    onChange={(e) => selecOptions('pais', e)}
                  />
                </div>
              </div>
              {canalSelected && productoSelected && paisSelected ? (
                <div className="mt-[50px] mb-[50px]">
                  <GraficoDeBarraCosto
                    typeView={typeViewGraf}
                    volumen={volGrafico}
                    comision={comisionGrafico}
                    cargos={cargasGrafico}
                    impuesto={impuestoGrafico}
                  />
                </div>
              ) : (
                <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                  <span className="text-center cursor-default">
                    Para visualizar este gráfico es necesario seleccionar Producto,
                    Canal y País.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        </>
      )
    }
    </>
    
  );
}

export default DashboardCostos;
