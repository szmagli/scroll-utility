import { SElement } from "./misc"

function maxMin(value: number, max: number) {
	return Math.max(Math.min(value, max), 0)
}

type EasingFunction = (
	currentStep: number,
	offsetValue: number,
	distance: number,
	totalSteps: number,
) => number

function ScrollElement(container: SElement) {
	let virtualPosition = container.scrollPosition()
	let finalPosition: number = virtualPosition
	let scrollAnimations: ({ position: (time: number) => number; duration: number })[] = []
	let durations: number[] = []
	let time = performance.now()
	function beforeUpdate() {
		const position = container.scrollPosition()
		const diff = Math.round(position) - Math.round(maxMin(virtualPosition, container.scrollSize()))
		virtualPosition = !!diff ? Math.round(position) : virtualPosition
		finalPosition += diff
	}
	function update(currentTime: number) {
		beforeUpdate()

		const previousPosition = container.scrollPosition()
		scrollAnimations = scrollAnimations.filter(animation => {
			virtualPosition -=
				virtualPosition - animation.position(time) + animation.position(currentTime)
			return currentTime >= animation.duration
		})
		const value = Math.round(virtualPosition) - previousPosition
		if (value !== 0) container.scrollBy(value)
		time = currentTime
		scrollAnimations.length > 0 ? requestAnimationFrame(update) : stop()
	}
	return (options: {
		value: number
		relative: boolean
		duration: number
		easing: EasingFunction
	}) => {
		scrollAnimations.length === 0 && beforeUpdate()
		const value = options.value + (options.relative ? finalPosition : -finalPosition)
		const initialTime = performance.now()
		durations.push(options.duration)
		scrollAnimations.push({
			duration: options.duration,
			position: (time: number) => options.easing(time - initialTime, 0, value, options.duration),
		})
		scrollAnimations.length === 1 && update(initialTime)
	}
}

export { ScrollElement }

export default ScrollElement
