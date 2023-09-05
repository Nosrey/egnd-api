import { Card, Tooltip } from 'components/ui';
import { useSelector } from 'react-redux';
import { formatearNumero } from 'utils/formatTotalsValues';
import { useMedia } from 'utils/hooks/useMedia';
import ShortNumberNotation from '../shortNumberNotation/ShortNumberNotation';

function Total({ title, data }) {
  const currency = useSelector((state) => state.auth.user.currency);
  const media = useMedia();

  return (
    <Card>
      <div
        className={`flex ${
          media === 'mobile' ? 'flex-col items-center' : 'justify-between'
        } cursor-default`}
      >
        <h3 className="cursor-default">{title}</h3>
        <span className="text-[#4f46e5] font-bold text-4xl">
          {currency}
          <Tooltip
            placement="top-end"
            title={currency + formatearNumero(data.toString())}
          >
            <ShortNumberNotation numero={data} />
          </Tooltip>
        </span>
      </div>
    </Card>
  );
}

export default Total;
