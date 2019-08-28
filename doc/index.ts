declare const ScrollUtility: typeof import("scroll-utility")

interface Window {
  scrollEasing: (easing: any) => void
  scrollDuration: (duration: any) => void
  scrollOnScroll: () => void
}

function rp(element: import("../dist/misc").ElementOrQuery) {
  return ScrollUtility.relativePosition(element) < 0.5 ? 1 : 0
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
