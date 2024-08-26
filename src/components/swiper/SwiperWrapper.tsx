import React, { PropsWithChildren, ReactElement } from 'react'

import styles from './SwiperWrapper.module.css'

function SwiperWrapper({ children }: PropsWithChildren): ReactElement {
  return <div className={styles.swiperRoot}>{children}</div>
}

export default SwiperWrapper
