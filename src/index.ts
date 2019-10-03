import { optionalScroll } from "./scroll";

export default optionalScroll({
	container: window,
	duration: 1000,
	easing: "easeInOutQuad",
	horizontal: false,
	force: false,
	onScroll: null,
	onStop: null
})();
