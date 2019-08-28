import { Scroll } from "scroll-utility"

const container: Window | Element | HTMLElement = window

const options: {
  horizontal?: boolean
  duration?: number
  easing?: string
  onScroll?: ((external?: boolean) => void) | null
} = {}

new Scroll(container, options)
