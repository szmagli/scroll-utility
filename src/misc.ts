interface SElement {
	element: HTMLElement | Window;
	horizontal: boolean;
	offset(): number;
	size(): number;
	scrollPosition(): number;
	scrollSize(): number;
	border(): number;
	relativePosition(): number;
	scrollBy(value: number): void;
}

function getElementWrapper(
	el: HTMLElement | Window,
	horizontal: boolean
): SElement {
	const scrollSize = isWindow(el)
		? horizontal
			? () =>
					Math.max(
						document.body.scrollWidth,
						document.body.offsetWidth,
						document.documentElement.clientWidth,
						document.documentElement.scrollWidth,
						document.documentElement.offsetWidth
					)
			: () =>
					Math.max(
						document.body.scrollHeight,
						document.body.offsetHeight,
						document.documentElement.clientHeight,
						document.documentElement.scrollHeight,
						document.documentElement.offsetHeight
					)
		: horizontal
		? () => el.scrollWidth
		: () => el.scrollHeight;

	const result = {
		element: el,
		horizontal,
		size: isWindow(el)
			? horizontal
				? () =>
						document.documentElement.clientWidth ||
						document.body.clientWidth ||
						window.innerWidth
				: () =>
						document.documentElement.clientHeight ||
						document.body.clientHeight ||
						window.innerHeight
			: horizontal
			? () => el.clientWidth
			: () => el.clientHeight,
		scrollSize: () => {
			return scrollSize() - result.size();
		},
		scrollPosition: isWindow(el)
			? horizontal
				? () => window.pageXOffset
				: () => window.pageYOffset
			: horizontal
			? () => el.scrollLeft
			: () => el.scrollTop,
		offset: isWindow(el)
			? horizontal
				? () =>
						document.documentElement.clientWidth ||
						document.body.clientWidth ||
						window.innerWidth
				: () =>
						document.documentElement.clientHeight ||
						document.body.clientHeight ||
						window.innerHeight
			: horizontal
			? () => el.offsetWidth
			: () => el.offsetHeight,
		border: isWindow(el)
			? () => 0
			: horizontal
			? () =>
					(parseInt(
						getComputedStyle(el, null).getPropertyValue("border-left-width"),
						10
					) || 0) +
					(parseInt(
						getComputedStyle(el, null).getPropertyValue("border-right-width"),
						10
					) || 0)
			: () =>
					(parseInt(
						getComputedStyle(el, null).getPropertyValue("border-top-width"),
						10
					) || 0) +
					(parseInt(
						getComputedStyle(el, null).getPropertyValue("border-bottom-width"),
						10
					) || 0),
		relativePosition: isWindow(el)
			? () => 0
			: horizontal
			? () => el.getBoundingClientRect().left
			: () => el.getBoundingClientRect().top,
		scrollBy: horizontal
			? (value: number) => el.scrollBy(value, 0)
			: (value: number) => el.scrollBy(0, value)
	};
	return result;
}

function isWindow(element: Element | Window): element is Window {
	return element === window;
}

export { SElement, getElementWrapper };
