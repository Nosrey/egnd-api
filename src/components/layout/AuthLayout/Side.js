import React, { cloneElement } from 'react'
import { Avatar } from 'components/ui'
import Logo from 'components/template/Logo'
import { APP_NAME } from 'constants/app.constant'

function Side({ children, content, ...rest }) {
  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
        style={{
          backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
        }}
      >
        <Logo mode="dark" />
        <div>
          <p className="text-lg text-white opacity-80">
           Nuestro sitio se encuentra en desarrollo, visite nuestro LinkedIn para estar al tanto de las novedades.
          </p>
        </div>
        <span className="text-white">
          Copyright &copy; {`${new Date().getFullYear()}`}{' '}
          <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
        </span>
      </div>
      <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children ? cloneElement(children, { ...rest }) : null}
        </div>
      </div>
    </div>
  )
}

export default Side
