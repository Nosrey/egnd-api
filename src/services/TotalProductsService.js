import { MONTHS } from 'constants/forms.constants';

let tot = [];

const configIncial = (vol) => {
  vol.map((o) => {
    tot[o.countryName] = {};
  });

  vol.map((o) => {
    o.stats.map((s) => {
      tot[o.countryName][s.canalName] = {};
    });
  });

  vol.map((o) => {
    o.stats.map((s) => {
      s.productos.map((p) => {
        tot[o.countryName][s.canalName][p.name] = [];
      });
    });
  });
};

export const resolveResul = (vol, precio, div) => {
  div = parseInt(div);
  vol = parseInt(vol);
  precio = parseInt(precio);

  let value = 0;
  const mult = vol * precio;

  if (div !== 0) {
    value = (div * mult) / 100;
    value = value.toFixed(1);
  }
  return parseInt(value);
};

export const calcTotal = (costoData, volumenData) => {
  configIncial(costoData);

  if (costoData.length !== 0 && volumenData.length !== 0) {
    costoData.map((p, indexInicial) => {
      p.stats.map((s, indexStats) => {
        s.productos.map((i, indexP) => {
          i.años.map((a, indexYear) => {
            MONTHS.forEach((m, indexMonth) => {
              if (!tot[p.countryName][s.canalName][i.name][indexYear]) {
                tot[p.countryName][s.canalName][i.name].push([
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]);
                tot[p.countryName][s.canalName][i.name][indexYear][
                  indexMonth
                ] +=
                  resolveResul(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],

                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .comision,
                  ) +
                  resolveResul(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],

                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .impuesto,
                  ) +
                  resolveResul(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],

                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .cargos,
                  ) +
                  parseInt(
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m] *
                      costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].años[indexYear].volMeses[m],
                  );
              } else {
                tot[p.countryName][s.canalName][i.name][indexYear][
                  indexMonth
                ] +=
                  resolveResul(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],

                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .comision,
                  ) +
                  resolveResul(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],

                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .impuesto,
                  ) +
                  resolveResul(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],

                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .cargos,
                  ) +
                  parseInt(
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m] *
                      costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].años[indexYear].volMeses[m],
                  );
              }
            });
          });
        });
      });
    });
  }

  return tot;
};
