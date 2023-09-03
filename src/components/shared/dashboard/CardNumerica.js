/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Tooltip } from 'components/ui';
import { formatearNumero } from 'utils/formatTotalsValues';
import { useSelector } from 'react-redux';
import ShortNumberNotation from '../shortNumberNotation/ShortNumberNotation';

function CardNumerica({ type, title, cantidad, hasCurrency }) {
  const currency = useSelector((state) => state.auth.user.currency);
  const isNull = isNaN(cantidad) || cantidad === Infinity;
  return (
    <Card>
      <div className="flex flex-col items-center justify-center gap-[10px]  relative cursor-default h-[110px]">
        <span className="text-sm text-left w-full absolute top-0">{title}</span>
        <span className="font-bold text-2xl text-black mt-[15px]">
          {hasCurrency && currency}
          <Tooltip
            placement="top-end"
            title={currency + formatearNumero(Math.round(cantidad).toString())}
          >
            {isNull
              ? 0 : 
              <ShortNumberNotation numero={Math.round(cantidad)} />
            }

          </Tooltip>
          
        </span>
      </div>
    </Card>
  );
}

export default CardNumerica;
