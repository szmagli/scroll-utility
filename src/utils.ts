export type EasingFunction = (
	currentStep: number,
	offsetValue: number,
	distance: number,
	totalSteps: number
) => number;

async function waitNextAnimationFrame(): Promise<number> {
	return new Promise(s => {
		requestAnimationFrame(s);
	});
}

class ScrollManager {
	async scrollTo(position: number, easing: EasingFunction, duration: number) {
		const initialPosition = window.pageYOffset;
		const distance = position - initialPosition;
		const initialTime = performance.now();
		const finalTime = initialTime + duration;
		let currentTime = initialTime;
		while (currentTime < finalTime) {
			window.scrollTo({
				top: easing(currentTime, initialPosition, distance, finalTime)
			});
			currentTime = await waitNextAnimationFrame();
		}
	}
}

export const scroller = new ScrollManager();
