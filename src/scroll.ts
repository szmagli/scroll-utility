import { getElementWrapper, SElement } from "./misc"
import { ScrollAnimation, ScrollAnimationPosition } from "./animation"
import { EasingOrFunction, ElementOrQuery } from "./types"
import { Easings } from "./easings"

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
		return ScrollElement({
			...defaultOptions,
			...options,
		})
	}
}

interface IScrollElement {
	element: Window | Element
	virtualPosition: number
	finalPosition: number | (() => number)
	scrollAnimations: ScrollAnimation[]
}

const ScrollElements: IScrollElement[][] = [[], []]

function ScrollElement(options: IScrollOptions) {
	const containerRaw = getElementFromQuery(options.container)
	const container = getElementWrapper(containerRaw)
	const horizontal = options.horizontal
	const indexedDirection = horizontal ? 1 : 0
	let index = ScrollElements[indexedDirection].findIndex(value => containerRaw === value.element)
	if (index <= 0) {
		index = ScrollElements[indexedDirection].length
	}
	const currentPosition = options.horizontal ? container.scrollLeft : container.scrollTop
	const element: IScrollElement = {
		...{
			element: container,
			scrollAnimations: [],
			virtualPosition: currentPosition,
			finalPosition: currentPosition,
		},
		...ScrollElements[indexedDirection][index],
	}
	return Scroll({ ...options, ...element })
}

export function Scroll(options: IScrollOptions & IScrollElement) {
	const containerRaw = getElementFromQuery(options.container)
	const container = getElementWrapper(containerRaw)
	function size() {
		return options.horizontal ? container.clientWidth : container.clientHeight
	}
	function scrollSize() {
		return options.horizontal ? container.scrollWidth : container.scrollHeight
	}
	function scrollPosition() {
		return options.horizontal ? container.scrollLeft : container.scrollTop
	}
	function relativePosition(query: ElementOrQuery): number {
		const elementRaw = getElementFromQuery(query)
		if (elementRaw === containerRaw) return scrollPosition() / scrollSize()
		const element = getElementWrapper(elementRaw)
		return getOffset(element) / getDiff(element)
	}
	function distToElement(query: ElementOrQuery, value = 0): number {
		const element = getElementWrapper(getElementFromQuery(query))
		return getOffset(element) - getDiff(element) * value
	}
	function elementSize(query: ElementOrQuery, value = 1): number {
		const element = getElementWrapper(getElementFromQuery(query))
		return (options.horizontal ? element.clientWidth : element.clientHeight) * value
	}
	function stop() {
		options.scrollAnimations = []
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
	function getOffset(el: SElement) {
		return options.horizontal
			? el.getBoundingClientRect().left -
					container.getBoundingClientRect().left -
					container.getBorderWidth()
			: el.getBoundingClientRect().top -
					container.getBoundingClientRect().top -
					container.getBorderHeight()
	}
	function getDiff(el: SElement) {
		return options.horizontal
			? container.clientWidth - el.clientWidth
			: container.clientHeight - el.clientHeight
	}
	function _beforeScroll() {
		if (!options.scrollAnimations.length) {
			const position = scrollPosition()
			if (!!Math.round(options.virtualPosition - position)) {
				options.virtualPosition = position
			}
			options.finalPosition = options.virtualPosition
		}
	}
	function _createScrollAnimation(from: ScrollAnimationPosition, to: ScrollAnimationPosition) {
		const easing = typeof options.easing === "string" ? Easings[options.easing] : options.easing
		options.scrollAnimations.push(new ScrollAnimation(from, to, { ...options, easing }))
		if (options.scrollAnimations.length === 1) {
			_update()
		}
	}
	function _onScroll() {
		const diff =
			Math.round(scrollPosition()) - Math.round(maxMin(options.virtualPosition, scrollSize()))
		const external = !!diff
		if (external) {
			options.virtualPosition = Math.round(scrollPosition())
			const from = options.finalPosition
			options.finalPosition = () => getValue(from) + diff
		}
	}
	function _update() {
		_onScroll()
		const previousPosition = scrollPosition
		options.scrollAnimations = options.scrollAnimations.filter(animation => {
			options.virtualPosition =
				(animation.options.force ? animation.from : options.virtualPosition - animation.distance) +
				animation.updateDistance()
			return !animation.isPastAnimation()
		})
		const value = Math.round(options.virtualPosition) - previousPosition()
		if (value !== 0)
			options.horizontal ? container.scrollBy(value, 0) : container.scrollBy(0, value)
		options.scrollAnimations.length > 0 ? requestAnimationFrame(() => _update()) : stop()
	}
	function _offsetElement(query: ElementOrQuery, value: number = 1) {
		const to = elementSize(query, value)
		_offsetValue(to)
	}
	function _offsetValue(value: number | (() => number)) {
		const from = options.force ? scrollPosition() : getValue(options.finalPosition)
		const _to = () => maxMin(getValue(value) + from, scrollSize())
		options.finalPosition = options.force ? _to : getValue(_to)
		_createScrollAnimation(from, options.finalPosition)
	}
	function _scrollToValue(value: number | (() => number)) {
		const from = options.force ? scrollPosition : getValue(options.finalPosition)
		const _to = () => getValue(value)
		options.finalPosition = options.force ? _to : getValue(_to)
		_createScrollAnimation(from, options.finalPosition)
	}
	function _scrollToElement(query: ElementOrQuery, value: number = 0) {
		const element = getElementFromQuery(query)
		const to =
			element === containerRaw
				? () => scrollSize() * value
				: () => distToElement(element, value) + scrollPosition()
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

export function getElementFromQuery(elementOrQuery: ElementOrQuery): HTMLElement | Window {
	if (!elementOrQuery) throw new Error(`elementOrQuery should not be a ${typeof elementOrQuery}`)
	const element =
		typeof elementOrQuery === "string" ? document.querySelector(elementOrQuery) : elementOrQuery
	if (!element) throw new Error(`no element matched querySelector ${elementOrQuery}`)
	return element === document.documentElement ? window : (element as HTMLElement)
}
