import { scroller, EasingFunction } from "./utils";

function easeInOutQuad(t: number, b: number, c: number, d: number) {
	if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
	return (-c / 2) * (--t * (t - 2) - 1) + b;
}

interface Options {
	easing: EasingFunction;
	duration: number;
}

export function scrollToElement(
	element: HTMLElement,
	options: Partial<Options> & { percent?: number } = {}
) {
	const percent = options.percent ?? 0.5;
	const offset = element.getBoundingClientRect().top;
	const diff =
		(document.documentElement.clientHeight ??
			document.body.clientHeight ??
			window.innerHeight) - element.offsetHeight;
	const distanceToElement = offset - diff * percent;
	scrollBy(distanceToElement, options);
}

export function scrollBy(amount: number, options: Partial<Options> = {}) {
	scrollTo(window.pageYOffset + amount, options);
}

export function scrollTo(position: number, options: Partial<Options> = {}) {
	scroller.scrollTo(
		position,
		options.easing ?? easeInOutQuad,
		options.duration ?? 1000
	);
}
