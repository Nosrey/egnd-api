import React from 'react'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'
import { Input } from 'components/ui'

function NumberInput({ inputSuffix, inputPrefix, ...props }) {
  return (
    <Input
      {...props}
      value={props.value}
      suffix={inputSuffix}
      prefix={inputPrefix}
    />
  )
}

function NumberFormatInput({ onValueChange, form, field, ...rest }) {
  return (
    <NumberFormat
      customInput={NumberInput}
      onValueChange={onValueChange}
      form={form}
      field={field}
      onBlur={field?.onBlur}
      {...rest}
    />
  )
}

function FormNumericInput({
  form,
  field,
  inputSuffix,
  inputPrefix,
  onValueChange,
  ...rest
}) {
  return (
    <NumberFormatInput
      form={form}
      field={field}
      inputPrefix={inputPrefix}
      inputSuffix={inputSuffix}
      onValueChange={onValueChange}
      {...rest}
    />
  )
}

FormNumericInput.propTypes = {
  form: PropTypes.object,
  field: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  }),
  inputSuffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  inputPrefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

export default FormNumericInput
