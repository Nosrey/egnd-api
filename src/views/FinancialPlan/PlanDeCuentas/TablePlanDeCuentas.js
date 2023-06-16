/* eslint-disable no-nested-ternary */
/* eslint-disable spaced-comment */
import {
  Avatar,
  FormContainer,
  FormItem,
  Input,
} from 'components/ui';
import { MdDelete } from 'react-icons/md';
import { useMedia } from 'utils/hooks/useMedia';

function TablePlanDeCuentas({
  cuentas
}) {
  const media = useMedia();


  return (
    <div className="px-4 py-5">
      <FormContainer>
        <div className="flex flex-col gap-y-6">
          <div
            className={`grid grid-cols-12 items-center gap-x-3 gap-y-2 font-bold auto-cols-max ${
              media === 'mobile' ? 'w-[600px]' : ''
            }`}
          >
            <span className="col-start-1 col-end-2 ">#</span>
            <span className="col-start-2 col-end-3">Código</span>
            <span className="col-start-3 col-end-7">Cuenta</span>
            <span className="col-start-7 col-end-9">Rubro</span>
            <span className="col-start-9 col-end-12">Clasificación</span>
            <span className="col-start-12 col-end-13">Estado Financiero</span>
          </div>
          <div>
            {cuentas && cuentas.length > 0 ? (
              cuentas.map((cta, index) => (
                <div
                  className={`grid grid-cols-12 items-center gap-x-3 mb-6 auto-cols-max ${
                    media === 'mobile' ? 'w-[600px]' : ''
                  }`}
                  key={index}
                >
                  <Avatar className="col-start-1 col-end-2  row-start-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                    {cta.indice}
                  </Avatar>
                  <FormItem className="col-start-2 col-end-3 row-start-2 mb-0">
                    <Input
                      name="codigo"
                      value={cta.codigo}
                      type="text"
                      disabled
                    />
                  </FormItem>

                  <FormItem className="col-start-3 col-end-7 font-bold row-start-2 mb-0">
                    <Input
                        name="cuenta"
                        value={cta.cuenta}
                        type="text"
                        disabled
                      />
                  </FormItem>

                  <FormItem className="col-start-7 col-end-9 row-start-2 mb-0">
                    <Input
                        name="rubro"
                        value={cta.rubro}
                        type="text"
                        disabled
                      />
                  </FormItem>
                  <FormItem className="col-start-9 col-end-12 row-start-2 mb-0">
                    <Input
                        name="clasificacion"
                        value={cta.clasificacion}
                        type="text"
                        disabled
                      />
                  </FormItem>
                  <FormItem className="col-start-12 col-end-13 row-start-2 mb-0">
                    <Input
                        name="estadoFinanciero"
                        value={cta.estadoFinanciero}
                        type="text"
                        disabled
                      />
                  </FormItem>
                </div>
              ))
            ) : (
              <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]">
                <span>
                  No hay cuentas creados. Créalos con el botón de Agregar.
                </span>
              </div>
            )}
            <div>
              <div
                className={`grid grid-cols-12 items-center gap-x-3 gap-y-4  auto-cols-max
                               ${media === 'mobile' ? 'w-[600px]' : ''}
                            `}
              >
                <FormItem
                  className={`mb-0 ${
                    media === 'mobile'
                      ? 'col-start-5 col-end-12'
                      : media === 'tablet'
                      ? 'col-start-9 col-end-13'
                      : media === 'desktop'
                      ? 'col-start-8 col-end-13'
                      : 'col-start-10 col-end-13'
                  }`}
                 />
              </div>
            </div>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}

export default TablePlanDeCuentas;
