declare const ScrollUtility: typeof import("scroll-utility")
type Scroll = import("scroll-utility/dist/scroll").Scroll

interface Window {
  scrollEasing: (easing: string) => void
  scrollDuration: (duration: number) => void
  scrollOnScroll: (external: boolean) => void
  scrollConstructorContainer: (container?: boolean) => void
}

window.onload = () => {
  function rp(element: string) {
    return ScrollUtility.relativePosition(element) < 0.5 ? 1 : 0
  }

  let scrollContainer = new ScrollUtility.Scroll("#container")

  window.scrollConstructorContainer = container => {
    if (!!container) {
      scrollContainer.scrollTo(
        scrollContainer.scrollPosition < scrollContainer.scrollSize / 2
          ? scrollContainer.scrollSize
          : 0,
      )
    } else {
      const relPos = ScrollUtility.relativePosition("#container")
      const centered = relPos > -0.3 && relPos < 0.3
      if (centered) {
        ScrollUtility.scrollTo(0)
      } else {
        ScrollUtility.scrollTo("#container")
      }
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
