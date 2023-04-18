import React from 'react'
import { Prism } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function SyntaxHighlighter(props) {
  const { children, ...rest } = props

  return (
    <Prism style={oneDark} {...rest}>
      {children}
    </Prism>
  )
}

export default SyntaxHighlighter
