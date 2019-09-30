import { Misc, getElementFromQuery } from "./misc"
import { ScrollAnimation, ScrollAnimationPosition } from "./animation"
import { ElementOrQuery, EasingOrFunction } from "./types"
import { Easings } from "./easings"
// import { Easings } from "./easings"

const getValue = (funct: number | (() => number)) => {
	return typeof funct === "number" ? funct : funct()
}

function maxMin(value: number, max: number) {
	return Math.max(Math.min(value, max), 0)
}

export function Scroll(options: {
	container: Window | Element | string
	horizontal: boolean
	duration: number
	easing: EasingOrFunction
	force: boolean
}) {
	let _scrollAnimations: ScrollAnimation[] = []
	let virtualPosition: number = scrollPosition()
	let _to: number | (() => number) = virtualPosition
	const container = getElementFromQuery(options.container)
	const horizontal = options.horizontal
	container.addEventListener("scroll", () => _onScroll)

	// private _scrollAnimations: ScrollAnimation[] = []
	// private _horizontal: boolean
	function size() {
		return Misc.getSize(container, horizontal)
	}
	function scrollSize() {
		return Misc.getScrollSize(container, horizontal) - size()
	}
	function scrollPosition() {
		return Misc.getScrollPosition(container, horizontal)
	}
	function relativePosition(element: ElementOrQuery): number {
		const _element = getElementFromQuery(element)
		return _element === container
			? scrollPosition() / scrollSize()
			: Misc.getRelativeElementPosition(container, _element, horizontal)
	}
	function distToElement(element: ElementOrQuery, value = 0): number {
		return Misc.getDistToCenterElement(container, getElementFromQuery(element), horizontal, value)
	}
	function elementSize(element: ElementOrQuery, value = 1): number {
		return Misc.getSize(getElementFromQuery(element), horizontal) * value
	}
	function stop() {
		// _scrollAnimations = []
		// _beforeScroll()
	}
	function scrollTo(...args: [number] | [ElementOrQuery, number]) {
		// _beforeScroll()
		const element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0
		element === null
			? _scrollToValue(maxMin(value, scrollSize()))
			: _scrollToElement(element, value)
	}
	function offset(...args: [number] | [ElementOrQuery, number]) {
		// _beforeScroll()
		const element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0
		element === null ? _offsetValue(value) : _offsetElement(element, value)
	}
	// function _beforeScroll() {
	// 	if (!_scrollAnimations.length) {
	// 		const position = scrollPosition
	// 		if (!!Math.round(virtualPosition - position)) {
	// 			virtualPosition = position
	// 		}
	// 		_to = virtualPosition
	// 	}
	// }
	function _createScrollAnimation(from: ScrollAnimationPosition, to: ScrollAnimationPosition) {
		const easing = typeof options.easing === "string" ? Easings[options.easing] : options.easing
		_scrollAnimations.push(new ScrollAnimation(from, to, { ...options, easing }))
		if (_scrollAnimations.length === 1) {
			_update()
		}
	}
	function _onScroll() {
		const diff = Math.round(scrollPosition()) - Math.round(maxMin(virtualPosition, scrollSize()))
		const external = !!diff
		if (external) {
			virtualPosition = Math.round(scrollPosition())
			const from = _to
			_to = () => getValue(from) + diff
		}
		// onScroll && onScroll(external)
	}
	function _update() {
		const previousPosition = scrollPosition
		_scrollAnimations = _scrollAnimations.filter(animation => {
			virtualPosition =
				(animation.options.force ? animation.from : virtualPosition - animation.distance) +
				animation.updateDistance()
			return !animation.isPastAnimation()
		})
		const value = Math.round(virtualPosition) - previousPosition()
		!!value && Misc.scrollBy(container, horizontal, value)
		_scrollAnimations.length > 0 ? requestAnimationFrame(() => _update()) : stop()
	}
	// function _getOptions(options: Partial<IScrollOptions> = {}) {
	// 	const easing = options.easing || easing || "easeInOutQuad"
	// 	return {
	// 		easing: typeof easing === "string" ? Easings[easing] : easing,
	// 		duration: options.duration === undefined ? duration : options.duration,
	// 		force: options.force === undefined ? force : options.force,
	// 	}
	// }
	function _offsetElement(element: ElementOrQuery, value: number = 1) {
		const to = elementSize(element, value)
		_offsetValue(to)
	}
	function _offsetValue(value: number | (() => number)) {
		const from = options.force ? scrollPosition() : getValue(_to)
		const to = () => maxMin(getValue(value) + from, scrollSize())
		_to = options.force ? to : getValue(to)
		_createScrollAnimation(from, _to)
	}
	function _scrollToValue(value: number | (() => number)) {
		const from = options.force ? scrollPosition : getValue(_to)
		const to = () => getValue(value)
		_to = options.force ? to : getValue(to)
		_createScrollAnimation(from, _to)
	}
	function _scrollToElement(element: ElementOrQuery, value: number = 0) {
		const _element = getElementFromQuery(element)
		const to =
			_element === container
				? () => scrollSize() * value
				: () => distToElement(_element, value) + scrollPosition()
		_scrollToValue(to)
	}

	const scroll = {
		size,
		scrollSize,
		scrollPosition,
		relativePosition,
		distToElement,
		elementSize,
		stop,
		scrollTo: (...args: [number] | [ElementOrQuery, number]) => {
			scrollTo(...args)
			return scroll
		},
		offset: (...args: [number] | [ElementOrQuery, number]) => {
			offset(...args)
			return scroll
		},
	}
	return scroll
}
