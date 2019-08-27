declare const ScrollUtility: typeof import("scroll-utility")

interface Window {
  scrollEasing
  scrollDuration
  scrollOnScroll
}

function rp(element) {
  return ScrollUtility.relativePosition(element) < 0.5 ? 1 : 0
}

window.scrollEasing = easing => {
  const element = "#scroll-easings"
  ScrollUtility.scroll(element, rp(element), { easing })
}
window.scrollDuration = duration => {
  const element = "#scroll-duration"
  ScrollUtility.scroll(element, rp(element), { duration })
}
window.scrollOnScroll = () => {
  const element = "#scroll-onScroll"
  ScrollUtility.scroll(element, rp(element), { duration: 2000 })
  ScrollUtility.onScroll = external => {
    if (external) {
      ScrollUtility.stop()
      ScrollUtility.onScroll = null
      alert("external scroll detected!")
    }
  }
}
