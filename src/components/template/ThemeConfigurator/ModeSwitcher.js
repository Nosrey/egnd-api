import React, { useCallback } from 'react'
import useDarkMode from 'utils/hooks/useDarkMode'
import { Switcher } from 'components/ui'

function ModeSwitcher() {
  const [isDark, setIsDark] = useDarkMode()

  const onSwitchChange = useCallback(
    (checked) => {
      setIsDark(checked ? 'dark' : 'light')
    },
    [setIsDark]
  )

  return (
    <div>
      <Switcher
        defaultChecked={isDark}
        onChange={(checked) => onSwitchChange(checked)}
      />
    </div>
  )
}

export default ModeSwitcher
