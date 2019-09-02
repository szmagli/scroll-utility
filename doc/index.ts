type IScrollUtility = import("scroll-utility")
declare const ScrollUtility: typeof import("scroll-utility")

// https://www.cssscript.com/minimal-notification-popup-pure-javascript/
declare const createNotification: any

function notify(message: string) {
  createNotification({
    showDuration: 2500,
    theme: "info",
  })({ message })
}

window.onload = () => {
  scrollManager = new ScrollUtility()
}

function rp(
  scrollManager: IScrollUtility,
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

function rp1(scrollManager: IScrollUtility) {
  return scrollManager.scrollTo(
    scrollManager.scrollPosition < scrollManager.scrollSize / 2 ? scrollManager.scrollSize : 0,
  )
}

let scrollManager: IScrollUtility

let scrollV: IScrollUtility,
  scrollH: IScrollUtility | undefined,
  scrollC: IScrollUtility | undefined

const examples = {
  constructor: {
    horizontal: (direction: string) => {
      const container = "#scroll-horizontal"
      scrollV = scrollV || new ScrollUtility({ container })
      scrollH = scrollH || new ScrollUtility({ container, horizontal: true })
      rp1(direction === "horizontal" ? scrollH : scrollV)
    },
    container: (wrapper: string) => {
      if (!!wrapper) {
        const container = "#container"
        scrollC = scrollC || new ScrollUtility({ container })
        rp1(scrollC)
      } else {
        const element = "#scroll-container"
        rp(scrollManager, element)
      }
    },
    easing: (easing: string) => {
      const element = "#scroll-easings"
      rp(scrollManager, element, { easing })
    },
    duration: (duration: number) => {
      const element = "#scroll-duration"
      rp(scrollManager, element, { duration })
    },
    onScroll: () => {
      const element = "#scroll-onScrollUtility"
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
    },
    onStop: () => {
      const element = "#scroll-onStop"
      rp(scrollManager, element)
      scrollManager.onStop = () => {
        notify("scroll ended!")
        scrollManager.onStop = null
      }
    },
    force: (type: string) => {
      const element = "#scroll-force"
      scrollManager.force = type === "force"
      rp(scrollManager, element, { duration: 2000 })
      scrollManager.onStop = () => {
        scrollManager.force = false
        scrollManager.onStop = null
      }
    },
  },
  scrollTo: Object.assign(() => {}, {
    element: (value: number) => {
      const element = "#scrollTo-value"
      ScrollUtility.global.scrollTo(element, value)
    },
  }),
}

interface Window {
  example: typeof examples
}

window.example = examples
