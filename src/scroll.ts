import { getElementWrapper, SElement } from "./misc";
import { easingFromFunction } from "./easings";

export type ElementOrQuery = Element | Window | string;

function maxMin(value: number, max: number, min: number = 0) {
	return Math.max(Math.min(value, max), min);
}

interface IScrollElement {
	container: SElement;
	scrollAnimation: {
		scrollAnimations: ({
			position: (time: number) => number;
			duration: number;
		})[];
		virtualPosition: number;
		finalPosition: number;
		previousTime: number;
	};
}

const ScrollElements: IScrollElement[] = [];

export interface IScroll {
	container?: Element | Window | string;
	horizontal?: boolean;
	duration?: number;
	easing?:
		| string
		| ((
				currentStep: number,
				offsetValue: number,
				distance: number,
				totalSteps: number
		  ) => number);
	onStop?: null | (() => void);
	onScroll?: null | ((external?: boolean) => void);
	force?: boolean;
}

export function optionalScroll(options: Required<IScroll>) {
	const container = getElementWrapper(
		getElementFromQuery(options.container),
		options.horizontal
	);
	let index = ScrollElements.findIndex(
		value =>
			container.element === value.container.element &&
			container.horizontal === value.container.horizontal
	);
	if (index < 0) {
		index = ScrollElements.length;
		ScrollElements.push({
			container: container,
			scrollAnimation: {
				scrollAnimations: [],
				virtualPosition: container.scrollPosition(),
				finalPosition: container.scrollPosition(),
				previousTime: performance.now()
			}
		});
	}
	const easing = easingFromFunction(options.easing);
	const onStop = options.onStop === null ? () => null : options.onStop;
	const onScroll = options.onScroll === null ? () => null : options.onScroll;
	const scrollAnimation = ScrollElements[index].scrollAnimation;

	function stop() {
		scrollAnimation.scrollAnimations = [];
	}
	function update(currentTime: number) {
		const position = container.scrollPosition();
		const diff =
			Math.round(position) -
			Math.round(
				maxMin(scrollAnimation.virtualPosition, container.scrollSize())
			);
		scrollAnimation.virtualPosition = !!diff
			? Math.round(position)
			: scrollAnimation.virtualPosition;
		scrollAnimation.finalPosition += diff;
		onScroll(!!diff);
		const previousPosition = container.scrollPosition();
		scrollAnimation.scrollAnimations = scrollAnimation.scrollAnimations.filter(
			animation => {
				scrollAnimation.virtualPosition +=
					animation.position(currentTime) -
					animation.position(scrollAnimation.previousTime);
				return currentTime < animation.duration;
			}
		);
		const value =
			Math.round(scrollAnimation.virtualPosition) - previousPosition;
		if (value !== 0) container.scrollBy(value);
		scrollAnimation.previousTime = currentTime;
		!!scrollAnimation.scrollAnimations.length
			? requestAnimationFrame(update)
			: onStop();
	}

	function resetScrollAnimation() {
		if (!scrollAnimation.scrollAnimations.length) {
			(scrollAnimation.virtualPosition = container.scrollPosition()),
				(scrollAnimation.finalPosition = container.scrollPosition()),
				(scrollAnimation.previousTime = performance.now());
		}
	}

	function create(value: number) {
		const initialTime = performance.now();
		scrollAnimation.finalPosition += value;
		const duration = options.duration + initialTime;
		scrollAnimation.scrollAnimations.push({
			duration,
			position: (time: number) =>
				easing(
					maxMin(time - initialTime, options.duration, 0),
					scrollAnimation.finalPosition - value,
					value,
					options.duration
				)
		});
		scrollAnimation.scrollAnimations.length === 1 && update(initialTime);
	}

	///

	function getRelativePosition(query: ElementOrQuery): number {
		const elementRaw = getElementFromQuery(query);
		if (elementRaw === container.element)
			return container.scrollPosition() / scroll.getScrollSize();
		const _element = getElementWrapper(elementRaw, container.horizontal);
		return getOffset(_element) / getDiff(_element);
	}
	function getDistToElement(query: ElementOrQuery, value = 0): number {
		const element = getElementWrapper(
			getElementFromQuery(query),
			container.horizontal
		);
		return getOffset(element) - getDiff(element) * value;
	}
	function getElementSize(query: ElementOrQuery, value = 1): number {
		const element = getElementWrapper(
			getElementFromQuery(query),
			container.horizontal
		);
		return element.size() * value;
	}
	function scrollTo(...args: [number] | [ElementOrQuery, number]) {
		const _element: ElementOrQuery | null =
			typeof args[0] === "number" ? null : args[0];
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0;
		_element === null
			? _scrollToValue(maxMin(value, scroll.getScrollSize()))
			: _scrollToElement(_element, value);
	}
	function offset(...args: [number] | [ElementOrQuery, number]) {
		const _element: ElementOrQuery | null =
			typeof args[0] === "number" ? null : args[0];
		const value = typeof args[0] === "number" ? args[0] : args[1] || 0;
		_element === null ? _offsetValue(value) : _offsetElement(_element, value);
	}
	function getOffset(el: SElement) {
		return (
			el.relativePosition() - container.relativePosition() - container.border()
		);
	}
	function getDiff(el: SElement) {
		return scroll.getSize() - el.offset();
	}
	function _offsetElement(query: ElementOrQuery, value: number = 1) {
		const to = getElementSize(query, value);
		_offsetValue(to);
	}
	function _offsetValue(value: number) {
		resetScrollAnimation();
		create(maxMin(value, scroll.getScrollSize()));
	}
	function _scrollToValue(value: number) {
		resetScrollAnimation();
		create(value - scrollAnimation.finalPosition);
	}
	function _scrollToElement(query: ElementOrQuery, value: number = 0) {
		const _element = getElementFromQuery(query);
		const to =
			_element === container.element
				? scroll.getScrollSize() * value
				: getDistToElement(_element, value) + container.scrollPosition();
		_scrollToValue(to);
	}

	const scroll = {
		getSize: container.size,
		getScrollSize: container.scrollSize,
		getScrollPosition: container.scrollPosition,
		getRelativePosition,
		getDistToElement,
		getElementSize,
		stop,
		scrollTo(...args: [number] | [ElementOrQuery, number]) {
			scrollTo(...args);
			return scroll;
		},
		offset: (...args: [number] | [ElementOrQuery, number]) => {
			offset(...args);
			return scroll;
		}
	};
	return Object.assign(
		(newOptions: IScroll) => optionalScroll({ ...options, ...newOptions }),
		scroll
	);
}

export function getElementFromQuery(
	elementOrQuery: ElementOrQuery
): HTMLElement | Window {
	if (!elementOrQuery)
		throw new Error(`elementOrQuery should not be a ${typeof elementOrQuery}`);
	const element =
		typeof elementOrQuery === "string"
			? document.querySelector(elementOrQuery)
			: elementOrQuery;
	if (!element)
		throw new Error(`no element matched querySelector ${elementOrQuery}`);
	if (element !== window && !(element instanceof HTMLElement))
		throw new Error("element should be an instance of HTMLElement"); // TODO improve warning
	return element === document.documentElement
		? window
		: (element as HTMLElement);
}
