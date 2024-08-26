import React, { ReactElement, useRef } from 'react'
import { SpringValue, animated } from '@react-spring/web'

import { hasMovedEnough } from '@/components/swiper/SwiperAnimationUtils'

type Props = {
  maxWidth: number
  trigger: SpringValue<number>
}

function VibrationTrigger({ maxWidth, trigger }: Props): ReactElement | null {
  const triggerRef = useRef(false)

  return (
    <animated.div
      data-whatever={trigger.to((val) => {
        const enough = hasMovedEnough(val, maxWidth)

        if (enough && !triggerRef.current) {
          triggerRef.current = true
          window.navigator.vibrate(100)
        }

        if (!enough) {
          triggerRef.current = false
        }
      })}
    />
  )
}

export default VibrationTrigger
