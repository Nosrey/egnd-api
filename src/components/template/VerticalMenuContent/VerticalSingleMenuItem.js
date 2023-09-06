import React from 'react'
import { Menu, Tooltip } from 'components/ui'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { AuthorityCheck } from 'components/shared'
import VerticalMenuIcon from './VerticalMenuIcon'

const { MenuItem } = Menu

function CollapsedItem({ title, translateKey, children, direction }) {
  const { t } = useTranslation()

  return (
    <Tooltip
      title={t(translateKey) || title}
      placement={direction === 'rtl' ? 'left' : 'right'}
    >
      {children}
    </Tooltip>
  )
}

function DefaultItem(props) {
  const { nav, onLinkClick, sideCollapsed, userAuthority } = props

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
        <Link
          to={nav.path}
          onClick={() =>
            onLinkClick?.({
              key: nav.key,
              title: nav.title,
              path: nav.path,
            })
          }
          className="flex items-center h-full w-full"
        >
          <VerticalMenuIcon icon={nav.icon} />
          {!sideCollapsed && (
            <span className="cursor-default">
              <Trans i18nKey={nav.translateKey} defaults={nav.title} />
            </span>
          )}
        </Link>
      </MenuItem>
    </AuthorityCheck>
  )
}

function VerticalSingleMenuItem({
  nav,
  onLinkClick,
  sideCollapsed,
  userAuthority,
  direction,
}) {
  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      {sideCollapsed ? (
        <CollapsedItem
          title={nav.title}
          translateKey={nav.translateKey}
          direction={direction}
        >
          <DefaultItem
            nav={nav}
            sideCollapsed={sideCollapsed}
            onLinkClick={onLinkClick}
            userAuthority={userAuthority}
          />
        </CollapsedItem>
      ) : (
        <DefaultItem
          nav={nav}
          sideCollapsed={sideCollapsed}
          onLinkClick={onLinkClick}
          userAuthority={userAuthority}
        />
      )}
    </AuthorityCheck>
  )
}

export default VerticalSingleMenuItem
