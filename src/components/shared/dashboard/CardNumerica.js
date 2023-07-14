/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from 'components/ui';

function CardNumerica({ type, title, cantidad }) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-[10px]">
        <span className="text-lg">{title} </span>
        <span className="font-bold text-2xl text-black">
          {type === 'default' ? cantidad.toFixed(2) : cantidad.toFixed(0)}
        </span>
      </div>
    </Card>
  );
}

export default CardNumerica;
