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
	force: boolean
	previousTime: number
	onscroll: (external?: boolean) => void
	onstop: () => void
} {
	const position = container.scrollPosition()
	return {
		virtualPosition: position,
		finalPosition: position,
		force: false,
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
		force: boolean
	})[] = []
	function stop() {
		scrollAnimations = []
	}
	function update(currentTime: number) {
		if (opts.force) {
			const position = container.scrollPosition()
			const diff =
				Math.round(position) - Math.round(maxMin(opts.virtualPosition, container.scrollSize()))
			opts.virtualPosition = !!diff ? Math.round(position) : opts.virtualPosition
			opts.finalPosition += diff
			opts.onscroll(!!diff)
		} else {
			opts.onscroll(false)
		}
		const previousPosition = container.scrollPosition()
		opts.force = false
		scrollAnimations = scrollAnimations.filter(animation => {
			opts.onscroll = animation.onScroll
			opts.onstop = animation.onStop
			opts.force = opts.force || animation.force
			if (!opts.force) {
				opts.virtualPosition +=
					animation.position(currentTime) - animation.position(opts.previousTime)
			}
			if (animation.force) {
				opts.virtualPosition = animation.position(currentTime)
			}
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
			force: boolean
			relative: boolean
		}) => {
			const initialTime = performance.now()
			if (!scrollAnimations.length) {
				opts = getOptions(container)
			}
			const from = options.force ? container.scrollPosition() : opts.finalPosition
			const relative = options.relative ? 0 : from
			const value = options.value - relative
			opts.finalPosition += value
			const duration = options.duration + initialTime
			scrollAnimations.push({
				...options,
				duration,
				position: (time: number) =>
					options.easing(
						maxMin(time - initialTime, options.duration, 0),
						from,
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
