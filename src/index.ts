import { optionalScroll } from "./scroll";

const ScrollUtility = optionalScroll({
	container: window,
	duration: 1000,
	easing: "easeInOutQuad",
	horizontal: false,
	onScroll: null,
	onStop: null
});

export default ScrollUtility;
module.exports = ScrollUtility;
