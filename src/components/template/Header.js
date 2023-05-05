import React, { useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { HEADER_HEIGHT_CLASS } from 'constants/theme.constant'
import { useDispatch, useSelector } from 'react-redux'
import { setFalse } from 'store/icon/iconSlice'

function Header(props) {
    const { headerStart, headerEnd, headerMiddle, className, container } = props
    const currentCurrency = useSelector((state) => state.auth.user.currency)

    const isTrue = useSelector((state) => state.icon)
    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(setFalse())
    }


    let flagComponent

    switch (currentCurrency) {
        case '$':
            flagComponent = (
                <>
                    <span className="font-bold">$</span>
                    <img
                        className="w-8"
                        src="https://img.icons8.com/color/256/argentina.png"
                        alt="Argentina Flag"
                    />
                </>
            )
            break
        case 'US$':
            flagComponent = (
                <>
                    <span className="font-bold">$</span>
                    <img
                        className="w-8"
                        src="https://img.icons8.com/color/256/usa.png"
                        alt="USA Flag"
                    />
                </>
            )
            break
        case '€':
            flagComponent = (
                <>
                    <span className="font-bold">€</span>
                    <img
                        className="w-8"
                        src="https://img.icons8.com/color/256/flag-of-europe.png"
                        alt="Euro Flag"
                    />
                </>
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
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handleClick();
                        }
                      }}
                >
                    {headerStart}
                </div>
                <div className="flex items-center">
                    <div className="flex items-center gap-x-1.5">
                        {flagComponent}
                    </div>
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
