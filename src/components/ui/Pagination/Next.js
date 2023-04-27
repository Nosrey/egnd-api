import React from 'react'
import classNames from 'classnames'
import { HiChevronRight } from 'react-icons/hi'

function Next(props) {
  const { currentPage, pageCount, pagerClass, onNext } = props

  const disabled = currentPage === pageCount || pageCount === 0

  const onNextClick = (e) => {
    e.preventDefault()
    if (disabled) {
      return
    }
    onNext(e)
  }

  const pagerNextClass = classNames(
    pagerClass.default,
    'pagination-pager-next',
    disabled ? pagerClass.disabled : pagerClass.inactive
  )

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span className={pagerNextClass} onClick={onNextClick}>
      <HiChevronRight />
    </span>
  )
}

export default Next
