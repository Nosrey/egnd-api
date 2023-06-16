import React from 'react'
import PropTypes from 'prop-types'

function TextEllipsis(props) {
  const { text, maxTextCount } = props

  return (
    <div>
      {(text && text.length) > maxTextCount
        ? `${text.substring(0, maxTextCount - 3)}...`
        : text}
    </div>
  )
}

TextEllipsis.propTypes = {
  text: PropTypes.string,
  maxTextCount: PropTypes.number
}

TextEllipsis.defaultProps = {
  text: '',
  maxTextCount: 0,
}

export default TextEllipsis
