import { ElementOrQuery, ScrollElement } from "./types"

function body() {
	return document.body
}
function html() {
	return (
		document.documentElement || {
			clientWidth: 0,
			clientHeight: 0,
			scrollWidth: 0,
			scrollHeight: 0,
			offsetWidth: 0,
			offsetHeight: 0,
		}
	)
}

// https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
const windowSize = (horizontal = false) =>
	horizontal
		? html().clientWidth || body().clientWidth || window.innerWidth
		: html().clientHeight || body().clientHeight || window.innerHeight

const windowScrollSize = (horizontal = false) =>
	horizontal
		? Math.max(
				body().scrollWidth,
				body().offsetWidth,
				html().clientWidth,
				html().scrollWidth,
				html().offsetWidth,
		  )
		: Math.max(
				body().scrollHeight,
				body().offsetHeight,
				html().clientHeight,
				html().scrollHeight,
				html().offsetHeight,
		  )

export function getElementFromQuery(elementOrQuery: ElementOrQuery): Element | Window {
	if (!elementOrQuery) {
		throw new Error(`elementOrQuery should not be a ${typeof elementOrQuery}`)
	}
	const element =
		typeof elementOrQuery === "string" ? document.querySelector(elementOrQuery) : elementOrQuery
	if (!element) {
		throw new Error(`no element matched querySelector ${elementOrQuery}`)
	}
	return element === document.documentElement ? window : element
}

function isWindow(element: Element | Window): element is Window {
	return element === window || element === html()
}

function withWindow<T>(
	element: ScrollElement,
	windowFunction: () => T,
	elementFunction: (element: HTMLElement) => T,
): T {
	return isWindow(element) ? windowFunction() : elementFunction(element as HTMLElement)
}

function getWithWindow<T>(
	windowFunction: (horizontal: boolean) => T,
	elementFunction: (element: HTMLElement, horizontal: boolean) => T,
) {
	return (element: ScrollElement, horizontal: boolean = false) => {
		return isWindow(element)
			? windowFunction(horizontal)
			: elementFunction(element as HTMLElement, horizontal)
	}
}

export namespace Misc {
	export const getSize = getWithWindow(windowSize, (element, horizontal) =>
		horizontal ? element.clientWidth : element.clientHeight,
	)

	export const getSizeWithBorders = getWithWindow(windowSize, (element, horizontal) =>
		horizontal ? element.offsetWidth : element.offsetHeight,
	)

	export const getScrollPosition = getWithWindow(
		horizontal => (horizontal ? window.pageXOffset : window.pageYOffset),
		(element, horizontal) => (horizontal ? element.scrollLeft : element.scrollTop),
	)

	export const getScrollSize = getWithWindow(
		horizontal => windowScrollSize(horizontal),
		(element, horizontal) => {
			return horizontal ? element.scrollWidth : element.scrollHeight
		},
	)
	const getBorderSize = getWithWindow(
		() => 0,
		(element, horizontal) =>
			parseInt(
				getComputedStyle(element, null).getPropertyValue(
					horizontal ? "border-left-width" : "border-top-width",
				),
				10,
			) || 0,
	)
	export const getOffset = getWithWindow(
		() => 0,
		(element, horizontal) =>
			horizontal ? element.getBoundingClientRect().left : element.getBoundingClientRect().top,
	)

	export function scrollTo(element: ScrollElement, x: number, y: number) {
		withWindow(
			element,
			() => window.scroll(x, y),
			element => {
				element.scrollLeft = x
				element.scrollTop = y
			},
		)
	}

	export function scrollBy(element: ScrollElement, horizontal: boolean, value: number) {
		element.scrollBy(horizontal ? value : 0, !horizontal ? value : 0)
	}

	export function scroll(element: ScrollElement, value: number, horizontal: boolean = false) {
		Misc.scrollTo(
			element,
			horizontal ? value : getScrollPosition(element, !horizontal),
			!horizontal ? value : getScrollPosition(element, !horizontal),
		)
	}

	export function getRelativeElementPosition(
		wrapper: ScrollElement,
		element: ScrollElement,
		horizontal = false,
	) {
		return withElementPosition(
			(elementPosition, elementProportion) => elementPosition / elementProportion,
			wrapper,
			element,
			horizontal,
		)
	}

	export function getDistToCenterElement(
		wrapper: ScrollElement,
		element: ScrollElement,
		horizontal = false,
		value = 0,
	) {
		return withElementPosition(
			(elementPosition, elementProportion) => elementPosition - elementProportion * value,
			wrapper,
			element,
			horizontal,
		)
	}
	function withElementPosition(
		funct: (elementPosition: number, elementProportion: number) => number,
		wrapper: ScrollElement,
		element: ScrollElement,
		horizontal: boolean,
	) {
		return funct(
			getOffset(element, horizontal) -
				getOffset(wrapper, horizontal) -
				getBorderSize(wrapper, horizontal),
			getSize(wrapper, horizontal) - getSizeWithBorders(element, horizontal),
		)
	}
}
