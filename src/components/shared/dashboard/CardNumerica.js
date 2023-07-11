import React from 'react';
import { Card } from 'components/ui';

function CardNumerica({ title, cantidad }) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-[10px]">
        <span className="text-lg">{title} </span>
        <span className="font-bold text-2xl text-black">{cantidad} </span>
      </div>
    </Card>
  );
}

export default CardNumerica;
