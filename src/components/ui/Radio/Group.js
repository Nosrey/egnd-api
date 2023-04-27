import React, { useState, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { RadioGroupContextProvider } from './context'

const Group = React.forwardRef((props, ref) => {
  const {
    color,
    disabled,
    name,
    onChange,
    radioGutter,
    value: valueProp,
    vertical,
    className,
    ...rest
  } = props

  const [value, setValue] = useState(valueProp)

  const onRadioGroupChange = useCallback(
    (nextValue, e) => {
      setValue(nextValue)
      onChange?.(nextValue, e)
    },
    [onChange, setValue]
  )

  const contextValue = useMemo(
    () => ({
      vertical,
      name,
      value: typeof value === 'undefined' ? null : value,
      color,
      disabled,
      radioGutter,
      onChange: onRadioGroupChange,
    }),
    [disabled, onRadioGroupChange, vertical, name, color, radioGutter, value]
  )

  const radioGroupClass = classNames(
    'radio-group',
    vertical && 'vertical',
    className
  )

  const groupChild = () => {
    const { children, id } = props
    return (
      <div id={id} ref={ref} className={radioGroupClass} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <RadioGroupContextProvider value={contextValue}>
      {groupChild()}
    </RadioGroupContextProvider>
  )
})

Group.defaultProps = {
  vertical: false,
  // eslint-disable-next-line react/default-props-match-prop-types
  radioGutter: 3,
}

Group.propTypes = {
  vertical: PropTypes.bool,
  color: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  name: PropTypes.string,
}

export default Group
