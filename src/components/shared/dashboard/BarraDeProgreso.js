// import { Progress } from 'components/ui';
import React from 'react';

function BarraDeProgreso({ paises }) {
  return (
    <div>
      {paises.map((country) => (
        <div key={country.name}>
          <h3>{country.name}</h3>
          <div
            style={{
              backgroundColor: 'lightgray',
              height: '20px',
              width: `${country.sales}px`,
            }}
          />
          <p>{country.sales} ventas</p>
        </div>
      ))}
    </div>
  );
}

export default BarraDeProgreso;
