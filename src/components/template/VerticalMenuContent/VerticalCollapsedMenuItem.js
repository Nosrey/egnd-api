import { AuthorityCheck } from 'components/shared'
import { Dropdown, Menu } from 'components/ui'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import VerticalMenuIcon from './VerticalMenuIcon'

const { MenuItem, MenuCollapse } = Menu

function DefaultItem({ nav, onLinkClick, userAuthority }) {
  const routeActive = useSelector((state) => state.base.common.currentRouteKey)
  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <MenuCollapse
        label={
          <>
            <VerticalMenuIcon icon={nav.icon} />
            <span className="cursor-default">
              <Trans i18nKey={nav.translateKey} defaults={nav.title} />
            </span>
          </>
        }
        key={nav.key}
        eventKey={nav.key}
        expanded={false}
        className=""
      >
        {nav.subMenu.map((subNav) => (
          <AuthorityCheck
            userAuthority={userAuthority}
            authority={subNav.authority}
            key={subNav.key}
          >
            <MenuItem
              eventKey={subNav.key}
              isActive={subNav.path === `/${routeActive}`}
            >
              {subNav.path ? (
                <Link
                  className="h-full w-full flex items-center"
                  onClick={() =>
                    onLinkClick?.({
                      key: subNav.key,
                      title: subNav.title,
                      path: subNav.path,
                    })
                  }
                  to={subNav.path}
                >
                  <span className="cursor-default">
                    <Trans
                      i18nKey={subNav.translateKey}
                      defaults={subNav.title}
                    />
                  </span>
                </Link>
              ) : (
                <span className="cursor-default">
                  <Trans
                    i18nKey={subNav.translateKey}
                    defaults={subNav.title}
                  />
                </span>
              )}
            </MenuItem>
          </AuthorityCheck>
        ))}
      </MenuCollapse>
    </AuthorityCheck>
  )
}

function CollapsedItem({ nav, onLinkClick, userAuthority, direction }) {
  const menuItem = (
    <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
      <VerticalMenuIcon icon={nav.icon} />
    </MenuItem>
  )

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <Dropdown
        trigger="hover"
        renderTitle={menuItem}
        placement={direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'}
      >
        {nav.subMenu.map((subNav) => console.log(subNav))}
      </Dropdown>
    </AuthorityCheck>
  )
}

function VerticalCollapsedMenuItem({ sideCollapsed, ...rest }) {
  return sideCollapsed ? <CollapsedItem {...rest} /> : <DefaultItem {...rest} />
}

export default VerticalCollapsedMenuItem
