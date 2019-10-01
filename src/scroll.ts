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

interface IScrollElement {
	element: Window | Element
	scrollElement: ScrollElement
}

const ScrollElements: IScrollElement[][] = [[], []]

class ScrollElement {
	public container = getElementWrapper(this.options.container)
	public horizontal = this.options.horizontal
	public virtualPosition: number = this.scrollPosition
	public finalPosition: number | (() => number) = this.virtualPosition
	scrollAnimations: ScrollAnimation[] = []
	constructor(private options: { container: HTMLElement | Window; horizontal: boolean }) {}
	public get scrollPosition() {
		return this.horizontal ? this.container.scrollLeft : this.container.scrollTop
	}
	public _createScrollAnimation(
		from: ScrollAnimationPosition,
		to: ScrollAnimationPosition,
		options: {
			easing: EasingOrFunction
			duration: number
			force: boolean
		},
	) {
		const easing = typeof options.easing === "string" ? Easings[options.easing] : options.easing
		this.scrollAnimations.push(new ScrollAnimation(from, to, { ...options, easing }))
		if (this.scrollAnimations.length === 1) {
			this._update()
		}
	}
	private _update() {
		this._onScroll()
		const previousPosition = this.scrollPosition
		this.scrollAnimations = this.scrollAnimations.filter(animation => {
			this.virtualPosition =
				(animation.options.force ? animation.from : this.virtualPosition - animation.distance) +
				animation.updateDistance()
			return !animation.isPastAnimation()
		})
		const value = Math.round(this.virtualPosition) - previousPosition
		if (value !== 0)
			this.horizontal ? this.container.scrollBy(value, 0) : this.container.scrollBy(0, value)
		this.scrollAnimations.length > 0 ? requestAnimationFrame(() => this._update()) : this.stop()
	}
	public stop() {
		this.scrollAnimations = []
		this._beforeScroll()
	}
	public _beforeScroll() {
		if (!this.scrollAnimations.length) {
			const position = this.scrollPosition
			if (!!Math.round(this.virtualPosition - position)) {
				this.virtualPosition = position
			}
			this.finalPosition = this.virtualPosition
		}
	}

	public _onScroll() {
		const diff =
			Math.round(this.scrollPosition) - Math.round(maxMin(this.virtualPosition, this.scrollSize))
		const external = !!diff
		if (external) {
			this.virtualPosition = Math.round(this.scrollPosition)
			const from = this.finalPosition
			this.finalPosition = () => getValue(from) + diff
		}
	}
	public get scrollSize() {
		return (this.horizontal ? this.container.scrollWidth : this.container.scrollHeight) - this.size
	}

	public get size() {
		return this.horizontal ? this.container.clientWidth : this.container.clientHeight
	}
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
		const mappedOptions = {
			...defaultOptions,
			...options,
		}
		const containerRaw = getElementFromQuery(mappedOptions.container)
		const horizontal = mappedOptions.horizontal
		const indexedDirection = horizontal ? 1 : 0
		let index = ScrollElements[indexedDirection].findIndex(value => containerRaw === value.element)
		if (index < 0) {
			index = ScrollElements[indexedDirection].length
			ScrollElements[indexedDirection][index] = {
				element: containerRaw,
				scrollElement: new ScrollElement({ container: containerRaw, horizontal }),
			}
		}
		return Scroll(ScrollElements[indexedDirection][index].scrollElement, mappedOptions)
	}
}

export function Scroll(element: ScrollElement, options: IScrollOptions) {
	const containerRaw = getElementFromQuery(options.container)
	function relativePosition(query: ElementOrQuery): number {
		const elementRaw = getElementFromQuery(query)
		if (elementRaw === containerRaw) return element.scrollPosition / element.scrollSize
		const _element = getElementWrapper(elementRaw)
		return getOffset(_element) / getDiff(_element)
	}
	function distToElement(query: ElementOrQuery, value = 0): number {
		const element = getElementWrapper(getElementFromQuery(query))
		return getOffset(element) - getDiff(element) * value
	}
	function elementSize(query: ElementOrQuery, value = 1): number {
		const element = getElementWrapper(getElementFromQuery(query))
		return (options.horizontal ? element.clientWidth : element.clientHeight) * value
	}
	function scrollTo(...args: [number] | [ElementOrQuery, number]) {
		element._beforeScroll()
		const _element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0
		_element === null
			? _scrollToValue(maxMin(value, element.scrollSize))
			: _scrollToElement(_element, value)
	}
	function offset(...args: [number] | [ElementOrQuery, number]) {
		element._beforeScroll()
		const _element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0
		_element === null ? _offsetValue(value) : _offsetElement(_element, value)
	}
	function getOffset(el: SElement) {
		return options.horizontal
			? el.getBoundingClientRect().left -
					element.container.getBoundingClientRect().left -
					element.container.getBorderWidth()
			: el.getBoundingClientRect().top -
					element.container.getBoundingClientRect().top -
					element.container.getBorderHeight()
	}
	function getDiff(el: SElement) {
		return options.horizontal
			? element.container.clientWidth - el.offsetWidth
			: element.container.clientHeight - el.offsetHeight
	}
	function _offsetElement(query: ElementOrQuery, value: number = 1) {
		const to = elementSize(query, value)
		_offsetValue(to)
	}
	function _offsetValue(value: number | (() => number)) {
		const from = options.force ? element.scrollPosition : getValue(element.finalPosition)
		const _to = () => maxMin(getValue(value) + from, element.scrollSize)
		element.finalPosition = options.force ? _to : getValue(_to)
		element._createScrollAnimation(from, element.finalPosition, options)
	}
	function _scrollToValue(value: number | (() => number)) {
		const from = options.force ? element.scrollPosition : getValue(element.finalPosition)
		const _to = () => getValue(value)
		element.finalPosition = options.force ? _to : getValue(_to)
		element._createScrollAnimation(from, element.finalPosition, options)
	}
	function _scrollToElement(query: ElementOrQuery, value: number = 0) {
		const _element = getElementFromQuery(query)
		const to =
			_element === containerRaw
				? () => element.scrollSize * value
				: () => distToElement(_element, value) + element.scrollPosition
		_scrollToValue(to)
	}

	const scroll = {
		size: () => element.size,
		scrollSize: () => element.scrollSize,
		scrollPosition: () => element.scrollPosition,
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
