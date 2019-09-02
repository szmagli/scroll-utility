declare const IScrollUtility: typeof import("scroll-utility")
declare class ScrollUtility extends IScrollUtility {}

// https://www.cssscript.com/minimal-notification-popup-pure-javascript/

declare let createNotification: any
function notify(message: string) {
  createNotification({ message })
}

interface Window {
  scrollOnStop: () => void
  createNotification: (arg0: {}) => any
  scrollContainer: (container?: boolean) => void
  scrollHorizontal: (direction: any) => void
  scrollEasing: (easing: string) => void
  scrollDuration: (duration: number) => void
  scrollOnScroll: (type: string) => void
  scrollForce: (force: string) => void
}

function rp(
  scrollManager: ScrollUtility,
  element: string,
  options?:
    | {
        duration?: number | undefined
        easing?: string | import("../dist/types").EasingFunction | undefined
        force?: boolean | undefined
      }
    | undefined,
) {
  return scrollManager.scrollTo(
    element,
    scrollManager.relativePosition(element) < 0.5 ? 1 : 0,
    options,
  )
}

function rp1(scrollManager: ScrollUtility) {
  return scrollManager.scrollTo(
    scrollManager.scrollPosition < scrollManager.scrollSize / 2 ? scrollManager.scrollSize : 0,
  )
}

let scrollManager: ScrollUtility

window.onload = () => {
  createNotification = window.createNotification({
    showDuration: 2500,
    theme: "info",
  })
  scrollManager = new ScrollUtility()
}

let scrollV: ScrollUtility | undefined,
  scrollH: ScrollUtility | undefined,
  scrollC: ScrollUtility | undefined

window.scrollHorizontal = direction => {
  const container = "#scroll-horizontal"
  scrollV = scrollV || new ScrollUtility({ container })
  scrollH = scrollH || new ScrollUtility({ container, horizontal: true })
  rp1(direction === "horizontal" ? scrollH : scrollV)
}
window.scrollContainer = wrapper => {
  if (!!wrapper) {
    const container = "#container"
    scrollC = scrollC || new ScrollUtility({ container })
    rp1(scrollC)
  } else {
    const element = "#scroll-container"
    rp(scrollManager, element)
  }
}
window.scrollEasing = easing => {
  const element = "#scroll-easings"
  rp(scrollManager, element, { easing })
}
window.scrollDuration = duration => {
  const element = "#scroll-duration"
  rp(scrollManager, element, { duration })
}
window.scrollOnScroll = () => {
  const element = "#scroll-onScroll"
  rp(scrollManager, element, { duration: 2000 })
  scrollManager.onScroll = external => {
    if (external) {
      notify("external scroll detected!")
    }
  }
  scrollManager.onStop = () => {
    scrollManager.onScroll = null
    scrollManager.onStop = null
  }
}

window.scrollOnStop = () => {
  const element = "#scroll-onStop"
  rp(scrollManager, element)
  scrollManager.onStop = () => {
    notify("scroll ended!")
    scrollManager.onStop = null
  }
}

window.scrollForce = (type: string) => {
  const element = "#scroll-force"
  scrollManager.force = type === "force"
  rp(scrollManager, element, { duration: 2000 })
  scrollManager.onStop = () => {
    scrollManager.force = false
    scrollManager.onStop = null
  }
}
