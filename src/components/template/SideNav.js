/* eslint-disable react/no-unused-prop-types */
import classNames from 'classnames'
import Logo from 'components/template/Logo'
import VerticalMenuContent from 'components/template/VerticalMenuContent'
import { ScrollBar } from 'components/ui'
import navigationConfig from 'configs/navigation.config'
import {
  LOGO_X_GUTTER,
  NAV_MODE_DARK,
  NAV_MODE_THEMED,
  NAV_MODE_TRANSPARENT,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_CONTENT_GUTTER,
  SIDE_NAV_WIDTH,
} from 'constants/theme.constant'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import useResponsive from 'utils/hooks/useResponsive'

const sideNavStyle = {
  width: SIDE_NAV_WIDTH,
  minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
  width: SIDE_NAV_COLLAPSED_WIDTH,
  minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

function SideNav() {
  const themeColor = useSelector((state) => state.theme.themeColor)
  const primaryColorLevel = useSelector(
    (state) => state.theme.primaryColorLevel
  )
  const navMode = useSelector((state) => state.theme.navMode)
  const mode = useSelector((state) => state.theme.mode)
  const direction = useSelector((state) => state.theme.direction)
  const currentRouteKey = useSelector(
    (state) => state.base.common.currentRouteKey
  )
  const sideNavCollapse = useSelector(
    (state) => state.theme.layout.sideNavCollapse
  )
  const userAuthority = useSelector((state) => state.auth.user.authority)

  const { larger } = useResponsive()

  const sideNavColor = () => {
    if (navMode === NAV_MODE_THEMED) {
      return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
    }
    return `side-nav-${navMode}`
  }

  const logoMode = () => {
    if (navMode === NAV_MODE_THEMED) {
      return NAV_MODE_DARK
    }

    if (navMode === NAV_MODE_TRANSPARENT) {
      return mode
    }

    return navMode
  }

  const menuContent = (
    <VerticalMenuContent
      navMode={navMode}
      collapsed={sideNavCollapse}
      navigationTree={navigationConfig}
      routeKey={currentRouteKey}
      userAuthority={userAuthority}
      direction={direction}
    />
  )

  const isTrue = useSelector((state) => state.icon)

  return (
    <>
      {larger.md && (
        <div
          style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
          className={classNames(
            'side-nav',
            sideNavColor(),
            !sideNavCollapse && 'side-nav-expand'
          )}
        >
          {isTrue ? (
            <div className="side-nav-header">
              <Logo
                mode={logoMode()}
                type={sideNavCollapse ? 'streamline' : 'full'}
                gutter={
                  sideNavCollapse ? SIDE_NAV_CONTENT_GUTTER : LOGO_X_GUTTER
                }
              />
            </div>
          ) : null}
          {sideNavCollapse ? (
            menuContent
          ) : (
            <div className="side-nav-content">
              <ScrollBar autoHide direction={direction}>
                {menuContent}
              </ScrollBar>
            </div>
          )}
        </div>
      )}
    </>
  )
}

SideNav.propTypes = {
  themed: PropTypes.bool,
  darkMode: PropTypes.bool,
  themeColor: PropTypes.string,
}

SideNav.defaultProps = {
  themed: false,
  darkMode: false,
  themeColor: '',
}

export default SideNav
