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
	function wHorizontal<T>(fh: () => T, fv: () => T) {
		return horizontal ? () => fh() : () => fv()
	}
	return {
		element: el,
		horizontal,
		size: wWindow(
			() =>
				wHorizontal(
					() => documentElement.clientWidth || document.body.clientWidth || window.innerWidth,
					() => documentElement.clientHeight || document.body.clientHeight || window.innerHeight,
				),
			el => wHorizontal(() => el.clientWidth, () => el.clientHeight),
		),
		scrollSize: wWindow(
			() =>
				wHorizontal(
					() =>
						Math.max(
							document.body.scrollWidth,
							document.body.offsetWidth,
							documentElement.clientWidth,
							documentElement.scrollWidth,
							documentElement.offsetWidth,
						),
					() =>
						Math.max(
							document.body.scrollHeight,
							document.body.offsetHeight,
							documentElement.clientHeight,
							documentElement.scrollHeight,
							documentElement.offsetHeight,
						),
				),
			el => wHorizontal(() => el.scrollWidth, () => el.scrollHeight),
		),
		scrollPosition: wWindow(
			() => wHorizontal(() => window.pageXOffset, () => window.pageYOffset),
			el => wHorizontal(() => el.scrollLeft, () => el.scrollTop),
		),
		offset: wWindow(
			() =>
				wHorizontal(
					() => documentElement.clientWidth || document.body.clientWidth || window.innerWidth,
					() => documentElement.clientHeight || document.body.clientHeight || window.innerHeight,
				),
			el => wHorizontal(() => el.offsetWidth, () => el.offsetHeight),
		),
		border: wWindow(
			() => () => 0,
			el =>
				wHorizontal(
					() => parseInt(getComputedStyle(el, null).getPropertyValue("border-left-width"), 10) || 0,
					() => parseInt(getComputedStyle(el, null).getPropertyValue("border-top-width"), 10) || 0,
				),
		),
		relativePosition: wWindow(
			() => () => 0,
			el =>
				wHorizontal(() => el.getBoundingClientRect().left, () => el.getBoundingClientRect().top),
		),
		scrollBy: wHorizontal(
			() => (value: number) => el.scrollBy(value, 0),
			() => (value: number) => el.scrollBy(0, value),
		),
	}
}

function isWindow(element: Element | Window): element is Window {
	return element === window
}

export { SElement, getElementWrapper }
