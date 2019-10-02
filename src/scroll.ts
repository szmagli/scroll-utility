import { getElementWrapper, SElement } from "./misc"
import { EasingOrFunction, ElementOrQuery, EasingFunction } from "./types"
import ScrollElement from "./core"
import { easingFromFunction } from "./easings"

function maxMin(value: number, max: number) {
	return Math.max(Math.min(value, max), 0)
}

type IScrollElement = ReturnType<typeof ScrollElement>

export interface IScrollOptions {
	duration: number
	easing: EasingOrFunction
}

const ScrollElements: {
	container: SElement
	createScrollAnimation: IScrollElement
}[][] = [[], []]

export interface IScroll {
	container?: Element | Window | string
	horizontal?: boolean
	duration?: number
	easing?:
		| string
		| ((currentStep: number, offsetValue: number, distance: number, totalSteps: number) => number)
}

export function optionalScroll(defaultOptions: Required<IScroll>) {
	return (newOptions: IScroll = {}) => {
		const options = {
			...defaultOptions,
			...newOptions,
		}
		const container = getElementWrapper(getElementFromQuery(options.container), options.horizontal)
		const horizontal = options.horizontal
		const indexedDirection = horizontal ? 1 : 0
		let index = ScrollElements[indexedDirection].findIndex(
			value => container.element === value.container.element,
		)
		if (index < 0) {
			index = ScrollElements[indexedDirection].length
			ScrollElements[indexedDirection][index] = {
				container: container,
				createScrollAnimation: ScrollElement(container),
			}
		}
		const createScrollAnimation = ScrollElements[indexedDirection][index].createScrollAnimation
		const easing = easingFromFunction(options.easing)
		return Scroll({ createScrollAnimation, container, duration: options.duration, easing })
	}
}

export function Scroll(options: {
	duration: number
	easing: EasingFunction
	createScrollAnimation: IScrollElement
	container: SElement
}) {
	function relativePosition(query: ElementOrQuery): number {
		const elementRaw = getElementFromQuery(query)
		if (elementRaw === options.container.element)
			return options.container.scrollPosition() / options.container.scrollSize()
		const _element = getElementWrapper(elementRaw, options.container.horizontal)
		return getOffset(_element) / getDiff(_element)
	}
	function distToElement(query: ElementOrQuery, value = 0): number {
		const element = getElementWrapper(getElementFromQuery(query), options.container.horizontal)
		return getOffset(element) - getDiff(element) * value
	}
	function elementSize(query: ElementOrQuery, value = 1): number {
		const element = getElementWrapper(getElementFromQuery(query), options.container.horizontal)
		return element.size() * value
	}
	function scrollTo(...args: [number] | [ElementOrQuery, number]) {
		const _element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0
		_element === null
			? _scrollToValue(maxMin(value, options.container.scrollSize()))
			: _scrollToElement(_element, value)
	}
	function offset(...args: [number] | [ElementOrQuery, number]) {
		const _element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0
		_element === null ? _offsetValue(value) : _offsetElement(_element, value)
	}
	function getOffset(el: SElement) {
		return el.relativePosition() - options.container.relativePosition() - options.container.border()
	}
	function getDiff(el: SElement) {
		return options.container.size() - el.offset()
	}
	function _offsetElement(query: ElementOrQuery, value: number = 1) {
		const to = elementSize(query, value)
		_offsetValue(to)
	}
	function _offsetValue(value: number) {
		const to = maxMin(value, options.container.scrollSize())
		options.createScrollAnimation({ ...options, value: to, relative: true })
	}
	function _scrollToValue(value: number) {
		options.createScrollAnimation({ ...options, value, relative: false })
	}
	function _scrollToElement(query: ElementOrQuery, value: number = 0) {
		const _element = getElementFromQuery(query)
		const to =
			_element === options.container.element
				? options.container.scrollSize() * value
				: distToElement(_element, value) + options.container.scrollPosition()
		_scrollToValue(to)
	}

	const scroll = {
		get size() {
			return options.container.size
		},
		get scrollSize() {
			return options.container.scrollSize() - scroll.size()
		},
		get scrollPosition() {
			return options.container.scrollPosition
		},
		relativePosition,
		distToElement,
		elementSize,
		stop,
		scrollTo(...args: [number] | [ElementOrQuery, number]) {
			scrollTo(...args)
			return scroll
		},
		offset: (...args: [number] | [ElementOrQuery, number]) => {
			offset(...args)
			return scroll
		},
	}
	return Object.assign(
		optionalScroll({
			container: options.container.element,
			duration: options.duration,
			easing: options.easing,
			horizontal: options.container.horizontal,
		}),
		scroll,
	)
}

export function getElementFromQuery(elementOrQuery: ElementOrQuery): HTMLElement | Window {
	if (!elementOrQuery) throw new Error(`elementOrQuery should not be a ${typeof elementOrQuery}`)
	const element =
		typeof elementOrQuery === "string" ? document.querySelector(elementOrQuery) : elementOrQuery
	if (!element) throw new Error(`no element matched querySelector ${elementOrQuery}`)
	if (element !== window && !(element instanceof HTMLElement))
		throw new Error("element should be an instance of HTMLElement") // TODO improve warning
	return element === document.documentElement ? window : (element as HTMLElement)
}
