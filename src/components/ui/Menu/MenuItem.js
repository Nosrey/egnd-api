import PropTypes from 'prop-types'
import Item from '../MenuItem'
import { CollapseContextConsumer } from './context/collapseContext'
import { GroupContextConsumer } from './context/groupContext'
import { MenuContextConsumer } from './context/menuContext'

const MenuItem = (props) => {
    const { eventKey, ...rest } = props

    //console.log(store, 'store')
    return (
        <MenuContextConsumer>
            {(context) => (
                <GroupContextConsumer>
                    {() => (
                        <CollapseContextConsumer>
                            {() => (
                                <Item
                                    onSelect={context.onSelect}
                                    menuItemHeight={context.menuItemHeight}
                                    variant={context.variant}
                                    isActive={context.defaultActiveKeys.includes(
                                        eventKey
                                    )}
                                    eventKey={eventKey}
                                    {...rest}
                                />
                            )}
                        </CollapseContextConsumer>
                    )}
                </GroupContextConsumer>
            )}
        </MenuContextConsumer>
    )
}

MenuItem.propTypes = {
    disabled: PropTypes.bool,
    eventKey: PropTypes.string,
}

export default MenuItem
