(function () {
	'use strict';

	function notify(message) {
	    createNotification({
	        showDuration: 1500,
	        theme: "info"
	    })({ message });
	}
	function rp(scrollManager, element) {
	    return scrollManager.scrollTo(element, scrollManager.getRelativePosition(element) < 0.5 ? 1 : 0);
	}
	window.onload = () => {
	    const examples = {
	        basicTo: (to) => {
	            const container = "#basic-usage";
	            ScrollUtility({ container }).scrollTo(to);
	        },
	        basicBy: (by) => {
	            const container = "#basic-usage";
	            ScrollUtility({ container }).scrollBy(by);
	        },
	        constructor: {
	            container: (wrapper) => {
	                if (!!wrapper) {
	                    const container = "#container";
	                    rp(ScrollUtility({ container }), container);
	                }
	                else {
	                    const element = "#scroll-container";
	                    rp(ScrollUtility, element);
	                }
	            },
	            horizontal: (direction) => {
	                const container = "#scroll-horizontal";
	                const horizontal = direction === "horizontal";
	                rp(ScrollUtility({ container, horizontal }), container);
	            },
	            easing: (easing) => {
	                const container = "#scroll-easings";
	                rp(ScrollUtility({ container, easing }), container);
	            },
	            duration: (duration) => {
	                const container = "#scroll-duration";
	                rp(ScrollUtility({ container, duration }), container);
	            },
	            force: (type) => {
	                const container = "#scroll-force";
	                rp(ScrollUtility({ container, duration: 2000, force: type === "force" }), container);
	            }
	        },
	        scrollTo: Object.assign((value) => {
	            const container = "#scrollTo";
	            ScrollUtility({ container }).scrollTo(value);
	        }, {
	            element: (value) => {
	                const container = "#example-scrollToElement";
	                const element = "#scrollTo-element";
	                ScrollUtility({ container }).scrollTo(element, value);
	            },
	            value: (value) => {
	                const container = "#scrollToValue";
	                ScrollUtility({ container }).scrollTo(value);
	            }
	        }),
	        offset: Object.assign((value) => {
	            const container = "#offset";
	            ScrollUtility({ container }).offset(value);
	        }, {
	            element: (value) => {
	                const container = "#offsetElement";
	                ScrollUtility({ container }).offset(container, value);
	            },
	            value: (value) => {
	                const container = "#offsetValue";
	                ScrollUtility({ container }).offset(value);
	            }
	        }),
	        scrollPosition: () => {
	            const container = "#scrollPosition";
	            notify(ScrollUtility({ container })
	                .scrollPosition()
	                .toString());
	        },
	        size: () => {
	            const container = "#size";
	            notify(ScrollUtility({ container })
	                .size()
	                .toString());
	        },
	        scrollSize: () => {
	            const container = "#scrollSize";
	            notify(ScrollUtility({ container })
	                .scrollSize()
	                .toString());
	        },
	        relativePosition: (value) => {
	            const container = "#relativePosition";
	            const element = "#relativePosition-element";
	            value !== undefined
	                ? ScrollUtility({ container }).scrollTo(element, value)
	                : notify(ScrollUtility.getRelativePosition(element).toString());
	        },
	        distToElement: (value) => {
	            const container = "#distToElement";
	            const element = "#distToElement-element";
	            notify(ScrollUtility({ container })
	                .distToElement(element, value)
	                .toString());
	        },
	        stop: (stop) => {
	            const container = "#stop";
	            if (stop) {
	                ScrollUtility.stop();
	            }
	            else {
	                rp(ScrollUtility({ container, duration: 2000 }), container);
	            }
	        }
	    };
	    window.example = examples;
	};

}());
