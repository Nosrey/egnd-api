import React from 'react';
import { Card } from 'components/ui';

function Total({ title, data }) {
  return (
    <Card>
      <div className="flex justify-between">
        <h3>{title}</h3>
        <span className="text-[#4f46e5] font-bold text-4xl">{data}</span>
      </div>
    </Card>
  );
}

export default Total;
