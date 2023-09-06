import React, { cloneElement } from 'react'
import { useLocation } from 'react-router-dom';
import { useMedia } from 'utils/hooks/useMedia';
import FooterAuth from './FooterAuth';

function Side({ children, content, ...rest }) {
    const media = useMedia();
    const location = useLocation()

  return (
    <><div className="grid  h-full">
      <div
        className={`bg-no-repeat bg-cover flex-col  flex ${media === "mobile" ? "items-center justify-center" : "py-6 px-16 justify-center items-center"}`}
        style={{
          backgroundImage: `url('/img/others/fondo.png')`,
        }}
      >
        <div className="flex flex-col justify-center items-center rounded-[20px] bg-[#F3F4F6] w-[60vw] min-w-[300px] max-w-xl py-4">
          <div className={`xl:min-w-[450px] px-8  ${location.pathname === "/crear-cuenta" ? "h-[80vh] max-h-[500px] containerRegister overflow-y-scroll" :"" } `}>
            <div className="mb-8">{content}</div>
            {children ? cloneElement(children, { ...rest }) : null}
          </div>
        </div>
      </div>

    </div><FooterAuth /></>
  )
}

export default Side
