import { optionalScroll } from "./scroll"

export = optionalScroll({
	container: window,
	duration: 1000,
	easing: "easeInOutQuad",
	force: false,
	horizontal: false,
})()
