import { SElement } from "./misc"
function maxMin(value: number, max: number, min: number = 0) {
	return Math.max(Math.min(value, max), min)
}

type EasingFunction = (
	currentStep: number,
	offsetValue: number,
	distance: number,
	totalSteps: number,
) => number

function getOptions(
	container: SElement,
): {
	virtualPosition: number
	finalPosition: number
	previousTime: number
	onscroll: (external?: boolean) => void
	onstop: () => void
} {
	const position = container.scrollPosition()
	return {
		virtualPosition: position,
		finalPosition: position,
		previousTime: performance.now(),
		onscroll: () => null,
		onstop: () => null,
	}
}

function ScrollElement(container: SElement) {
	let opts = getOptions(container)
	let scrollAnimations: ({
		position: (time: number) => number
		duration: number
		onScroll: (external?: boolean) => void
		onStop: () => void
	})[] = []
	function stop() {
		scrollAnimations = []
	}
	function update(currentTime: number) {
		const position = container.scrollPosition()
		const diff =
			Math.round(position) - Math.round(maxMin(opts.virtualPosition, container.scrollSize()))
		opts.virtualPosition = !!diff ? Math.round(position) : opts.virtualPosition
		opts.finalPosition += diff
		opts.onscroll(!!diff)
		const previousPosition = container.scrollPosition()
		scrollAnimations = scrollAnimations.filter(animation => {
			opts.onscroll = animation.onScroll
			opts.onstop = animation.onStop
			opts.virtualPosition +=
				animation.position(currentTime) - animation.position(opts.previousTime)
			return currentTime < animation.duration
		})
		const value = Math.round(opts.virtualPosition) - previousPosition
		if (value !== 0) container.scrollBy(value)
		opts.previousTime = currentTime
		!!scrollAnimations.length ? requestAnimationFrame(update) : opts.onstop()
	}
	return {
		stop,
		create: (options: {
			value: number
			duration: number
			easing: EasingFunction
			onStop: () => void
			onScroll: () => void
			relative: boolean
		}) => {
			const initialTime = performance.now()
			if (!scrollAnimations.length) {
				opts = getOptions(container)
			}
			const value = options.value - (options.relative ? 0 : opts.finalPosition)
			opts.finalPosition += value
			const duration = options.duration + initialTime
			scrollAnimations.push({
				...options,
				duration,
				position: (time: number) =>
					options.easing(
						maxMin(time - initialTime, options.duration, 0),
						opts.finalPosition - value,
						value,
						options.duration,
					),
			})
			scrollAnimations.length === 1 && update(initialTime)
		},
	}
}

export { ScrollElement }

export default ScrollElement
