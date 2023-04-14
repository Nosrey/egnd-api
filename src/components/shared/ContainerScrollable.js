import React, {useState, useRef } from 'react'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { useMedia } from 'utils/hooks/useMedia'


function ContainerScrollable(props) {
    const [scrollPosition, setScrollPosition] = useState(0)
    const containerTableRef = useRef(null)
    const btnLeftRef = useRef(null)
    const btnRightRef = useRef(null)
    const media = useMedia()

    const [activeDrag, setActiveDrag] = useState(false)

    const iconVisibility = () => {
        const containerTable = containerTableRef.current
        const btnLeft = btnLeftRef && btnLeftRef.current
        const btnRight = btnRightRef && btnRightRef.current

        let scrollLeftValue = Math.ceil(containerTable.scrollLeft)
        const tableWidth = containerTable.offsetWidth
        const contentWidth = containerTable.scrollWidth

        if (scrollLeftValue === 0) {
            btnLeft && (btnLeft.style.display = 'none')
        } else {
            btnLeft && (btnLeft.style.display = 'block')
        }

        if (contentWidth - tableWidth <= scrollLeftValue) {
            btnRight && (btnRight.style.display = 'none')
        } else {
            btnRight && (btnRight.style.display = 'block')
        }
    }

    const handleRightClick = () => {
        const newPosition = scrollPosition + 450
        containerTableRef.current.scrollLeft = newPosition
        setScrollPosition(newPosition)
        setTimeout(() => iconVisibility(), 50)
    }

    const handleLeftClick = () => {
        const newPosition = scrollPosition - 450
        containerTableRef.current.scrollLeft = newPosition
        setScrollPosition(newPosition)
        setTimeout(() => iconVisibility(), 50)
    }

    const handleMouseDown = () => {
        setActiveDrag(true)
        containerTableRef.current.classList.add('dragging')
    }

    const handleMouseMove = (drag) => {
        if (!activeDrag) return
        containerTableRef.current.scrollLeft -= drag.movementX
        iconVisibility()
    }

    const handleMouseUp = () => {
        setActiveDrag(false)
        containerTableRef.current.classList.remove('dragging')
    }

    return (             
        <div
            className="wrapper p-4 overflow-x-auto scroll-smooth relative "
            ref={containerTableRef}
            onScroll={iconVisibility}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
          {
                media !== 'mobile' && (
                    <><div className='fixed top-[55vh] z-50 cursor-pointer bg-[#f2f2f2] shadow-lg shadow-gray-300 w-[40px] h-[40px] rounded-full flex items-center justify-center'>
                        <BsChevronLeft
                            onClick={handleLeftClick}
                            className="text-2xl "
                            ref={btnLeftRef} />
                    </div><div className='fixed right-[5vw] top-[55vh] z-50 cursor-pointer bg-[#f2f2f2] shadow-lg shadow-gray-300 w-[40px] h-[40px] rounded-full flex items-center justify-center'>
                            <BsChevronRight
                                onClick={handleRightClick}
                                className="text-2xl "
                                ref={btnRightRef} />
                        </div></>
                )
          }
          
         

            {props.contenido}

        </div>
     )
}

export default ContainerScrollable
