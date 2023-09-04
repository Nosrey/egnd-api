import { Card, Progress } from 'components/ui';
import React from 'react';

function ProgresoCircular({ title, data, ancho }) {
  return (
    <Card className={`${ancho ? `w-[${ancho}]` : 'w-[30%]'}`}>
      <div className="flex flex-col items-center ">
        <span className="text-lg self-start mb-[40px] cursor-default">{title}</span>
        <Progress
          className="md:mb-0 md:mr-4 contents"
          variant="circle"
          percent={data}
          color="amber-300"
        />
      </div>
    </Card>
  );
}

export default ProgresoCircular;
