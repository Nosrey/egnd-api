import React from 'react'
import classNames from 'classnames'
import { Container } from 'components/shared'
import { APP_NAME } from 'constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from 'constants/theme.constant'
import { useMedia } from 'utils/hooks/useMedia'



function FooterContent() {
  const media = useMedia();

  return (
    <div className={`flex ${media === "mobile" ?  "flex-col": " items-center justify-between flex-auto w-full" }`}>
      <span className="cursor-default">
      <span className="font-semibold">{`${APP_NAME}`}</span> &copy; {`${new Date().getFullYear()}`}{' '}
        
      </span>
      <div className="">
          <span className="cursor-default">
           Desarrollado por {' '}
           <a className="text-gray font-semibold" href="https://yellowpatito.com/inicio" target='_blank' rel="noreferrer">
          Yellow Patito
        </a>
          </span>
        
      </div>
    </div>
  )
}

export default function Footer({ pageContainerType }) {
  return (
    <footer
      className={classNames(
        `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`
      )}
    >
      {pageContainerType === 'contained' ? (
        <Container>
          <FooterContent />
        </Container>
      ) : (
        <FooterContent />
      )}
    </footer>
  )
}
