declare const ScrollUtility: typeof import("scroll-utility")

interface Window {
  scrollEasing: (easing: string) => void
  scrollDuration: (duration: number) => void
  scrollOnScroll: (external: boolean) => void
  scrollContainer: (container?: boolean) => void
}

window.onload = () => {
  function rp(element: string) {
    console.log(ScrollUtility.relativePosition({ element }))
    return ScrollUtility.relativePosition({ element }) < 0.5 ? 1 : 0
  }

  const scrollContainerOptions = { container: "#container" }

  window.scrollContainer = container => {
    if (!!container) {
      const scrollContainer = ScrollUtility.new(scrollContainerOptions)
      const where =
        scrollContainer.getScrollPosition() < scrollContainer.getScrollSize() / 2
          ? scrollContainer.getScrollSize()
          : 0
      scrollContainer.scrollTo(where)
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
}
