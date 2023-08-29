import { Card } from 'components/ui';
import { useSelector } from 'react-redux';
import ShortNumberNotation from '../shortNumberNotation/ShortNumberNotation';

function Total({ title, data }) {
  const currency = useSelector((state) => state.auth.user.currency);
  return (
    <Card>
      <div className="flex justify-between">
        <h3>{title}</h3>
        <span className="text-[#4f46e5] font-bold text-4xl">
          {currency}
          <ShortNumberNotation numero={data} />
        </span>
      </div>
    </Card>
  );
}

export default Total;
