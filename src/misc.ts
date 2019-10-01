const documentElement = document.documentElement || {
	clientWidth: 0,
	clientHeight: 0,
	scrollWidth: 0,
	scrollHeight: 0,
	offsetWidth: 0,
	offsetHeight: 0,
}

export interface SElement {
	offsetWidth: number
	offsetHeight: number
	clientWidth: number
	clientHeight: number
	scrollLeft: number
	scrollTop: number
	scrollWidth: number
	scrollHeight: number
	getBorderWidth(): number
	getBorderHeight(): number
	getBoundingClientRect(): { left: number; top: number }
	scrollBy(x: number, y: number): void
}

// ref: https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
export const windowWrapper: SElement = {
	get offsetWidth() {
		return documentElement.clientWidth || document.body.clientWidth || window.innerWidth
	},
	get offsetHeight() {
		return documentElement.clientHeight || document.body.clientHeight || window.innerHeight
	},
	get clientWidth() {
		return this.offsetWidth
	},
	get clientHeight() {
		return this.offsetHeight
	},
	get scrollLeft() {
		return window.pageXOffset
	},
	get scrollTop() {
		return window.pageYOffset
	},
	get scrollWidth() {
		return Math.max(
			document.body.scrollWidth,
			document.body.offsetWidth,
			documentElement.clientWidth,
			documentElement.scrollWidth,
			documentElement.offsetWidth,
		)
	},
	get scrollHeight() {
		return Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			documentElement.clientHeight,
			documentElement.scrollHeight,
			documentElement.offsetHeight,
		)
	},
	getBorderWidth() {
		return 0
	},
	getBorderHeight() {
		return 0
	},
	getBoundingClientRect() {
		return { left: 0, top: 0 }
	},
	scrollBy(x: number, y: number) {
		window.scrollBy(x, y)
	},
}

function extend<T extends object, E extends object>(obj: T, ext: E): T & E {
	return new Proxy(
		{},
		{
			get(_target, key) {
				if (ext[key] !== undefined) return ext[key]
				if (typeof obj[key] === "function") return obj[key].bind(obj)
				return obj[key]
			},
			set(_target, key, value) {
				if (ext[key] !== undefined) return (ext[key] = value)
				return (obj[key] = value)
			},
		},
	) as T & E
}

export function getElementWrapper(el: HTMLElement | Window): SElement {
	if (isWindow(el)) return windowWrapper
	return extend(el, {
		getBorderWidth() {
			return parseInt(getComputedStyle(el, null).getPropertyValue("border-left-width"), 10) || 0
		},
		getBorderHeight() {
			return parseInt(getComputedStyle(el, null).getPropertyValue("border-top-width"), 10) || 0
		},
	})
}

export function isWindow(element: Element | Window): element is Window {
	return element === window || element === documentElement
}
