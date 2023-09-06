import React from 'react'
import { Link } from 'react-router-dom'

function HorizontalMenuNavLink({ path, children }) {
  return (
    <Link className="h-full w-full flex items-center" to={path}>
      <span className="cursor-default">{children}</span>
    </Link>
  )
}

export default HorizontalMenuNavLink
