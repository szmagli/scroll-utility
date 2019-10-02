const documentElement = document.documentElement || {
	clientWidth: 0,
	clientHeight: 0,
	scrollWidth: 0,
	scrollHeight: 0,
	offsetWidth: 0,
	offsetHeight: 0,
}

interface SElement {
	element: HTMLElement | Window
	horizontal: boolean
	offset(): number
	size(): number
	scrollPosition(): number
	scrollSize(): number
	border(): number
	relativePosition(): number
	scrollBy(value: number): void
}

function getElementWrapper(el: HTMLElement | Window, horizontal: boolean): SElement {
	function wWindow<T>(fw: (element: Window) => T, fe: (element: HTMLElement) => T) {
		return isWindow(el) ? fw(el) : fe(el)
	}
	const result = {
		element: el,
		horizontal,
		size: wWindow(
			() =>
				horizontal
					? () => documentElement.clientWidth || document.body.clientWidth || window.innerWidth
					: () => documentElement.clientHeight || document.body.clientHeight || window.innerHeight,
			el => (horizontal ? () => el.clientWidth : () => el.clientHeight),
		),
		scrollSize() {
			return (
				wWindow(
					() =>
						horizontal
							? () =>
									Math.max(
										document.body.scrollWidth,
										document.body.offsetWidth,
										documentElement.clientWidth,
										documentElement.scrollWidth,
										documentElement.offsetWidth,
									)
							: () =>
									Math.max(
										document.body.scrollHeight,
										document.body.offsetHeight,
										documentElement.clientHeight,
										documentElement.scrollHeight,
										documentElement.offsetHeight,
									),
					el => (horizontal ? () => el.scrollWidth : () => el.scrollHeight),
				)() - result.size()
			)
		},
		scrollPosition: wWindow(
			() => (horizontal ? () => window.pageXOffset : () => window.pageYOffset),
			el => (horizontal ? () => el.scrollLeft : () => el.scrollTop),
		),
		offset: wWindow(
			() =>
				horizontal
					? () => documentElement.clientWidth || document.body.clientWidth || window.innerWidth
					: () => documentElement.clientHeight || document.body.clientHeight || window.innerHeight,
			el => (horizontal ? () => el.offsetWidth : () => el.offsetHeight),
		),
		border: wWindow(
			() => () => 0,
			el =>
				horizontal
					? () =>
							parseInt(getComputedStyle(el, null).getPropertyValue("border-left-width"), 10) || 0
					: () =>
							parseInt(getComputedStyle(el, null).getPropertyValue("border-top-width"), 10) || 0,
		),
		relativePosition: wWindow(
			() => () => 0,
			el =>
				horizontal ? () => el.getBoundingClientRect().left : () => el.getBoundingClientRect().top,
		),
		scrollBy: horizontal
			? (value: number) => el.scrollBy(value, 0)
			: (value: number) => el.scrollBy(0, value),
	}
	return result
}

function isWindow(element: Element | Window): element is Window {
	return element === window
}

export { SElement, getElementWrapper }
