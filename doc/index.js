window.scrollManager = ScrollUtility.scrollManager
window.scrollEasing = easing => {
  const element = "#scroll-easings"
  const top = scrollManager.getRelativeElementPosition(element) < 0.5
  scrollManager.scroll(element, top ? 1 : 0, 1000, easing)
}
window.scrollDuration = duration => {
  const element = "#scroll-duration"
  const top = scrollManager.getRelativeElementPosition(element) < 0.5
  scrollManager.scroll(element, top ? 1 : 0, duration)
}
window.scrollOnScroll = () => {
  const scrolled = false
  const element = "#scroll-onScroll"
  const top = scrollManager.getRelativeElementPosition(element) < 0.5
  scrollManager.scroll(element, top ? 1 : 0, 2000)
  scrollManager.onScroll = external => {
    if (external) {
      scrollManager.stop
      scrollManager.onScroll = null
      alert("external scroll detected!")
    }
  }
}
