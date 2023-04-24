import React from 'react'
import PropTypes from 'prop-types'
import useAuthority from 'utils/hooks/useAuthority'

function AuthorityCheck(props) {
  const { userAuthority = [], authority = [], children } = props

  const roleMatched = useAuthority(userAuthority, authority)

  return roleMatched ? children : ""
}

AuthorityCheck.propTypes = {
  userAuthority: PropTypes.arrayOf(),
  authority: PropTypes.arrayOf(),
}

AuthorityCheck.defaultProps = {
  userAuthority: [],
  authority: [],
}


export default AuthorityCheck
