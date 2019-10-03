import { optionalScroll } from "./scroll"

export = optionalScroll({
	container: window,
	duration: 1000,
	easing: "easeInOutQuad",
	horizontal: false,
	force: false,
	onScroll: null,
	onStop: null,
})()
