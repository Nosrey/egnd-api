import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useConfig } from '../ConfigProvider'
import { MenuContextProvider } from './context/menuContext'

const Menu = React.forwardRef((props, ref) => {
    const {
        children,
        className,
        defaultActiveKeys,
        defaultExpandedKeys,
        menuItemHeight,
        onSelect,
        sideCollapsed,
        variant,
        ...rest
    } = props

    const menuDefaultClass = 'menu'

    const { themeColor, primaryColorLevel } = useConfig()

    const menuColor = () => {
        if (variant === 'themed') {
            return `bg-${themeColor}-${primaryColorLevel} ${menuDefaultClass}-${variant}`
        }
        return `${menuDefaultClass}-${variant}`
    }

    const menuClass = classNames(menuDefaultClass, menuColor(), className)

    return (
        <nav ref={ref} className={menuClass} {...rest}>
            <MenuContextProvider
                value={{
                    onSelect,
                    menuItemHeight,
                    variant,
                    sideCollapsed,
                    defaultExpandedKeys,
                    defaultActiveKeys,
                }}
            >
                {children}
            </MenuContextProvider>
        </nav>
    )
})

Menu.propTypes = {
    menuItemHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variant: PropTypes.oneOf(['light', 'dark', 'themed', 'transparent']),
    sideCollapsed: PropTypes.bool,
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultActiveKeys: PropTypes.arrayOf(PropTypes.string),
}

Menu.defaultProps = {
    menuItemHeight: 40,
    variant: 'light',
    sideCollapsed: false,
    defaultExpandedKeys: [],
    defaultActiveKeys: [],
}

export default Menu
