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

export interface IScrollOptions {
	container: Window | Element | string
	horizontal: boolean
	duration: number
	easing: EasingOrFunction
	force: boolean
}

export function optionalScroll(defaultOptions: IScrollOptions) {
	return (
		options: {
			container?: Window | Element | string
			horizontal?: boolean
			duration?: number
			easing?: EasingOrFunction
			force?: boolean
		} = {},
	) => {
		return Scroll({
			...defaultOptions,
			...options,
		})
	}
}

type IndexedValue<T> = T[][]

const scrollElements: IndexedValue<Window | Element> = [[], []]
const virtualPositions: IndexedValue<number> = [[], []]
const finalPositions: IndexedValue<number | (() => number)> = [[], []]
const scrollAnimations: IndexedValue<ScrollAnimation[]> = [[], []]

export function Scroll(options: IScrollOptions) {
	const container = getElementFromQuery(options.container)
	const horizontal = options.horizontal
	const indexedDirection = horizontal ? 1 : 0
	let index = scrollElements[indexedDirection].findIndex(value => container === value)
	if (index <= 0) {
		index = scrollElements[indexedDirection].length
	}

	function IndexerGetter<T>(container: IndexedValue<T>): (value?: T) => T {
		return (value?: T) =>
			(container[indexedDirection][index] =
				value === undefined ? container[indexedDirection][index] : value)
	}

	const scrollElement = IndexerGetter(scrollElements)
	scrollElement(container)
	const scrollAnimation = IndexerGetter(scrollAnimations)
	scrollAnimation(scrollAnimation() || [])
	const virtualPosition = IndexerGetter(virtualPositions)
	virtualPosition(virtualPosition() || Misc.getScrollPosition(container, horizontal))
	const finalPosition = IndexerGetter(finalPositions)
	finalPosition(finalPosition() || virtualPosition())

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
		scrollAnimation([])
		_beforeScroll()
	}
	function scrollTo(...args: [number] | [ElementOrQuery, number]) {
		_beforeScroll()
		const element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0
		element === null
			? _scrollToValue(maxMin(value, scrollSize()))
			: _scrollToElement(element, value)
	}
	function offset(...args: [number] | [ElementOrQuery, number]) {
		_beforeScroll()
		const element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0
		element === null ? _offsetValue(value) : _offsetElement(element, value)
	}
	function _beforeScroll() {
		if (!scrollAnimation().length) {
			const position = scrollPosition()
			if (!!Math.round(virtualPosition() - position)) {
				virtualPosition(position)
			}
			finalPosition(virtualPosition())
		}
	}
	function _createScrollAnimation(from: ScrollAnimationPosition, to: ScrollAnimationPosition) {
		const easing = typeof options.easing === "string" ? Easings[options.easing] : options.easing
		scrollAnimation().push(new ScrollAnimation(from, to, { ...options, easing }))
		if (scrollAnimation().length === 1) {
			_update()
		}
	}
	function _onScroll() {
		const diff = Math.round(scrollPosition()) - Math.round(maxMin(virtualPosition(), scrollSize()))
		const external = !!diff
		if (external) {
			virtualPosition(Math.round(scrollPosition()))
			const from = finalPosition()
			finalPosition(() => getValue(from) + diff)
		}
	}
	function _update() {
		_onScroll()
		const previousPosition = scrollPosition
		scrollAnimation(
			scrollAnimation().filter(animation => {
				virtualPosition(
					(animation.options.force ? animation.from : virtualPosition() - animation.distance) +
						animation.updateDistance(),
				)
				return !animation.isPastAnimation()
			}),
		)
		const value = Math.round(virtualPosition()) - previousPosition()
		!!value && Misc.scrollBy(container, horizontal, value)
		scrollAnimation.length > 0 ? requestAnimationFrame(() => _update()) : stop()
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
		_offsetValue(elementSize(element, value))
	}
	function _offsetValue(value: number | (() => number)) {
		const from = options.force ? scrollPosition() : getValue(finalPosition())
		const _to = () => maxMin(getValue(value) + from, scrollSize())
		finalPosition(options.force ? _to : getValue(_to))
		_createScrollAnimation(from, finalPosition())
	}
	function _scrollToValue(value: number | (() => number)) {
		const from = options.force ? scrollPosition : getValue(finalPosition())
		const _to = () => getValue(value)
		finalPosition(options.force ? _to : getValue(_to))
		_createScrollAnimation(from, finalPosition())
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
	return Object.assign(optionalScroll(options), scroll)
}
