/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from 'components/ui';

function CardNumerica({ type, title, cantidad }) {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center gap-[10px]  relative cursor-default h-[110px]">
        <span className="text-sm text-left w-full absolute top-0">{title} </span>
        <span className="font-bold text-2xl text-black mt-[15px]">      
          {type === 'default'
            ? cantidad.toFixed(2)
            : type === 'clear'
            ? cantidad
            : cantidad.toFixed(0)}
        </span>
      </div>
    </Card>
  );
}

export default CardNumerica;
