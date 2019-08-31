declare const ScrollUtility: typeof import("scroll-utility")

interface Window {
  scrollHorizontal
  scrollEasing: (easing: string) => void
  scrollDuration: (duration: number) => void
  scrollOnScroll: (external: boolean) => void
  scrollContainer: (container?: boolean) => void
}

function rp(element: string, horizontal?: boolean) {
  return ScrollUtility.relativePosition({ element, horizontal }) < 0.5 ? 1 : 0
}

function rp1(options: { container; duration? }) {
  return ScrollUtility.getScrollPosition(options) < ScrollUtility.getScrollSize(options) / 2
    ? ScrollUtility.getScrollSize(options)
    : 0
}

const scrollContainerOptions = { container: "#container" }

window.scrollHorizontal = direction => {
  const element = "#scroll-horizontal"
  const horizontal = direction === "horizontal"
  const options = { container: element, horizontal }
  ScrollUtility.scrollTo(rp1(options), options)
}

window.scrollContainer = container => {
  if (!!container) {
    const scrollContainer = ScrollUtility.new(scrollContainerOptions)
    scrollContainer.scrollTo(rp1(scrollContainerOptions))
  } else {
    const element = "#scroll-container"
    ScrollUtility.scrollTo(element, rp(element))
  }
}
window.scrollEasing = easing => {
  const element = "#scroll-easings"
  ScrollUtility.scrollTo(element, rp(element), { easing })
}
window.scrollDuration = duration => {
  const element = "#scroll-duration"
  ScrollUtility.scrollTo(element, rp(element), { duration })
}
window.scrollOnScroll = () => {
  const element = "#scroll-onScroll"
  ScrollUtility.scrollTo(element, rp(element), { duration: 2000 })
  ScrollUtility.onScroll = external => {
    if (external) {
      ScrollUtility.stop()
      ScrollUtility.onScroll = null
      alert("external scroll detected!")
    }
  }
}
