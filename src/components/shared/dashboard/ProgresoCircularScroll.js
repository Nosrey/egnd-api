import { Card, Progress } from 'components/ui';
import './scrollBar.css';

function ProgresoCircularScroll({ title, churnProducto }) {
  return (
    <Card className="w-[30%]">
      <div>
        <span className="text-lg">{title}</span>
        <div className="flex justify-center gap-[25px] mt-[10px]">
          <Progress
            className="md:mb-0 md:mr-4 mb-4 contents"
            variant="circle"
            percent={40}
          />
          <div className="max-h-[80px] overflow-y-auto custom-scrollbar pr-[8px]">
            {churnProducto.map((producto, index) => (
              <div key={index}>
                <span>{producto.channels}</span>
                <span>{producto.numero}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProgresoCircularScroll;
