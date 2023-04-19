import React, { useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { HEADER_HEIGHT_CLASS } from 'constants/theme.constant'
import { useDispatch } from 'react-redux'
import { setFalse } from 'store/icon/iconSlice'

function Header(props) {
    const { headerStart, headerEnd, headerMiddle, className, container } = props

    const isTrue = useSelector((state) => state.icon)
    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(setFalse())
    }

    useEffect(() => {
        console.log(isTrue)
    }, [isTrue])

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
                {headerMiddle && (
                    <div className="header-action header-action-middle">
                        {headerMiddle}
                    </div>
                )}
                <div className="header-action header-action-end">
                    {headerEnd}
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
