import React, { useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { HEADER_HEIGHT_CLASS } from 'constants/theme.constant'
import { useDispatch, useSelector } from 'react-redux'
import { setFalse } from 'store/icon/iconSlice'

const Header = (props) => {
    const { headerStart, headerEnd, headerMiddle, className, container } = props
    const currentCurrency = useSelector((state) => state.auth.user.currency)

    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(setFalse())
    }

    let flagComponent

    switch (currentCurrency) {
        case '$':
            flagComponent = <img src="../../assets/image/flag-argentina.png" />
            break
        case 'US$':
            flagComponent = <img src="../../assets/image/flag-eeuu.png" />
            break
        case '€':
            flagComponent = (
                <img src="../../assets/image/flag-union-europea.png" />
            )
            break
        default:
            flagComponent = null
            break
    }

    return (
        <header className={classNames('header', className)}>
            <div
                className={classNames(
                    'header-wrapper',
                    HEADER_HEIGHT_CLASS,
                    container && 'container mx-auto'
                )}
            >
                <div
                    className="header-action header-action-start"
                    onClick={handleClick}
                >
                    {headerStart}
                </div>
                <div className="flex items-center">
                    <div>{flagComponent}</div>
                    {headerMiddle && (
                        <div className="header-action header-action-middle">
                            {headerMiddle}
                        </div>
                    )}
                    <div className="header-action header-action-end">
                        {headerEnd}
                    </div>
                </div>
            </div>
        </header>
    )
}

Header.propTypes = {
    headerStart: PropTypes.node,
    headerEnd: PropTypes.node,
    container: PropTypes.bool,
}

export default Header
