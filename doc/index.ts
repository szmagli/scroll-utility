declare const ScrollUtility: typeof import("../src/index");

// https://www.cssscript.com/minimal-notification-popup-pure-javascript/
declare const createNotification: any;
type Params = Required<Exclude<Parameters<typeof ScrollUtility>[0], undefined>>;

function notify(message: string) {
	createNotification({
		showDuration: 1500,
		theme: "info"
	})({ message });
}

function rp(scrollManager: typeof ScrollUtility, element: string) {
	return scrollManager.scrollTo(
		element,
		scrollManager.getRelativePosition(element) < 0.5 ? 1 : 0
	);
}

window.onload = () => {
	const examples = {
		constructor: {
			container: (wrapper: boolean) => {
				if (!!wrapper) {
					const container = "#container";
					rp(ScrollUtility({ container }), container);
				} else {
					const element = "#scroll-container";
					rp(ScrollUtility, element);
				}
			},
			horizontal: (direction: string) => {
				const container = "#scroll-horizontal";
				const horizontal = direction === "horizontal";
				rp(ScrollUtility({ container, horizontal }), container);
			},
			easing: (easing: Params["easing"]) => {
				const container = "#scroll-easings";
				rp(ScrollUtility({ container, easing }), container);
			},
			duration: (duration: number) => {
				const container = "#scroll-duration";
				rp(ScrollUtility({ container, duration }), container);
			},
			force: (type: string) => {
				const container = "#scroll-force";
				rp(
					ScrollUtility({ container, duration: 2000, force: type === "force" }),
					container
				);
			}
		},
		scrollTo: Object.assign(
			(value: number) => {
				const container = "#scrollTo";
				ScrollUtility({ container }).scrollTo(value);
			},
			{
				element: (value: number) => {
					const container = "#example-scrollToElement";
					const element = "#scrollTo-element";
					ScrollUtility({ container }).scrollTo(element, value);
				},
				value: (value: number) => {
					const container = "#scrollToValue";
					ScrollUtility({ container }).scrollTo(value);
				}
			}
		),
		offset: Object.assign(
			(value: number) => {
				const container = "#offset";
				ScrollUtility({ container }).offset(value);
			},
			{
				element: (value: number) => {
					const container = "#offsetElement";
					ScrollUtility({ container }).offset(container, value);
				},
				value: (value: number) => {
					const container = "#offsetValue";
					ScrollUtility({ container }).offset(value);
				}
			}
		),
		scrollPosition: () => {
			const container = "#scrollPosition";
			notify(
				ScrollUtility({ container })
					.scrollPosition()
					.toString()
			);
		},
		size: () => {
			const container = "#size";
			notify(
				ScrollUtility({ container })
					.size()
					.toString()
			);
		},
		scrollSize: () => {
			const container = "#scrollSize";
			notify(
				ScrollUtility({ container })
					.scrollSize()
					.toString()
			);
		},
		relativePosition: (value?: number) => {
			const container = "#relativePosition";
			const element = "#relativePosition-element";
			value !== undefined
				? ScrollUtility({ container }).scrollTo(element, value)
				: notify(ScrollUtility.getRelativePosition(element).toString());
		},
		distToElement: (value?: number) => {
			const container = "#distToElement";
			const element = "#distToElement-element";
			notify(
				ScrollUtility({ container })
					.distToElement(element, value)
					.toString()
			);
		},
		stop: (stop: boolean) => {
			const container = "#stop";
			if (stop) {
				ScrollUtility.stop();
			} else {
				rp(ScrollUtility({ container, duration: 2000 }), container);
			}
		}
	};
	(window as any).example = examples;
};
