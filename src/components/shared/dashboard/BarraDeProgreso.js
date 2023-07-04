// import { Progress } from 'components/ui';
import { Progress } from 'components/ui';
import React from 'react';

function BarraDeProgreso({ paises }) {
  return (
    <div>
      {paises.map((country) => (
        <div key={country.name}>
          <span>{country.name}</span>
          <Progress percent={30} />
        </div>
      ))}
    </div>
  );
}

export default BarraDeProgreso;
