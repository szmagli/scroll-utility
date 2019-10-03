(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.ScrollUtility = factory());
}(this, function () { 'use strict';

	const documentElement = document.documentElement || {
	    clientWidth: 0,
	    clientHeight: 0,
	    scrollWidth: 0,
	    scrollHeight: 0,
	    offsetWidth: 0,
	    offsetHeight: 0,
	};
	function getElementWrapper(el, horizontal) {
	    const scrollSize = isWindow(el)
	        ? horizontal
	            ? () => Math.max(document.body.scrollWidth, document.body.offsetWidth, documentElement.clientWidth, documentElement.scrollWidth, documentElement.offsetWidth)
	            : () => Math.max(document.body.scrollHeight, document.body.offsetHeight, documentElement.clientHeight, documentElement.scrollHeight, documentElement.offsetHeight)
	        : horizontal
	            ? () => el.scrollWidth
	            : () => el.scrollHeight;
	    const result = {
	        element: el,
	        horizontal,
	        size: isWindow(el)
	            ? horizontal
	                ? () => documentElement.clientWidth || document.body.clientWidth || window.innerWidth
	                : () => documentElement.clientHeight || document.body.clientHeight || window.innerHeight
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
	                ? () => documentElement.clientWidth || document.body.clientWidth || window.innerWidth
	                : () => documentElement.clientHeight || document.body.clientHeight || window.innerHeight
	            : horizontal
	                ? () => el.offsetWidth
	                : () => el.offsetHeight,
	        border: isWindow(el)
	            ? () => 0
	            : horizontal
	                ? () => parseInt(getComputedStyle(el, null).getPropertyValue("border-left-width"), 10) || 0
	                : () => parseInt(getComputedStyle(el, null).getPropertyValue("border-top-width"), 10) || 0,
	        relativePosition: isWindow(el)
	            ? () => 0
	            : horizontal
	                ? () => el.getBoundingClientRect().left
	                : () => el.getBoundingClientRect().top,
	        scrollBy: horizontal
	            ? (value) => el.scrollBy(value, 0)
	            : (value) => el.scrollBy(0, value),
	    };
	    return result;
	}
	function isWindow(element) {
	    return element === window;
	}

	function maxMin(value, max, min = 0) {
	    return Math.max(Math.min(value, max), min);
	}
	function getOptions(container) {
	    const position = container.scrollPosition();
	    return {
	        virtualPosition: position,
	        finalPosition: position,
	        previousTime: performance.now(),
	        onscroll: () => null,
	        onstop: () => null,
	    };
	}
	function ScrollElement(container) {
	    let opts = getOptions(container);
	    let scrollAnimations = [];
	    function stop() {
	        scrollAnimations = [];
	    }
	    function update(currentTime) {
	        const position = container.scrollPosition();
	        const diff = Math.round(position) - Math.round(maxMin(opts.virtualPosition, container.scrollSize()));
	        opts.virtualPosition = !!diff ? Math.round(position) : opts.virtualPosition;
	        opts.finalPosition += diff;
	        opts.onscroll(!!diff);
	        const previousPosition = container.scrollPosition();
	        scrollAnimations = scrollAnimations.filter(animation => {
	            opts.onscroll = animation.onScroll;
	            opts.onstop = animation.onStop;
	            opts.virtualPosition +=
	                animation.position(currentTime) - animation.position(opts.previousTime);
	            return currentTime < animation.duration;
	        });
	        const value = Math.round(opts.virtualPosition) - previousPosition;
	        if (value !== 0)
	            container.scrollBy(value);
	        opts.previousTime = currentTime;
	        !!scrollAnimations.length ? requestAnimationFrame(update) : opts.onstop();
	    }
	    return {
	        stop,
	        create: (options) => {
	            const initialTime = performance.now();
	            if (!scrollAnimations.length) {
	                opts = getOptions(container);
	            }
	            const value = options.value - (options.relative ? 0 : opts.finalPosition);
	            opts.finalPosition += value;
	            const duration = options.duration + initialTime;
	            scrollAnimations.push(Object.assign(Object.assign({}, options), { duration, position: (time) => options.easing(maxMin(time - initialTime, options.duration, 0), opts.finalPosition - value, value, options.duration) }));
	            scrollAnimations.length === 1 && update(initialTime);
	        },
	    };
	}

	// tslint:disable
	function easingFromFunction(easing) {
	    return typeof easing === "string" ? Easings[easing] : easing;
	}
	const Easings = {
	    linear: function (t, b, c, d) {
	        return (c * t) / d + b;
	    },
	    easeInQuad: function (t, b, c, d) {
	        return c * (t /= d) * t + b;
	    },
	    easeOutQuad: function (t, b, c, d) {
	        return -c * (t /= d) * (t - 2) + b;
	    },
	    easeInOutQuad: function (t, b, c, d) {
	        if ((t /= d / 2) < 1)
	            return (c / 2) * t * t + b;
	        return (-c / 2) * (--t * (t - 2) - 1) + b;
	    },
	    easeInCubic: function (t, b, c, d) {
	        return c * (t /= d) * t * t + b;
	    },
	    easeOutCubic: function (t, b, c, d) {
	        return c * ((t = t / d - 1) * t * t + 1) + b;
	    },
	    easeInOutCubic: function (t, b, c, d) {
	        if ((t /= d / 2) < 1)
	            return (c / 2) * t * t * t + b;
	        return (c / 2) * ((t -= 2) * t * t + 2) + b;
	    },
	    easeInQuart: function (t, b, c, d) {
	        return c * (t /= d) * t * t * t + b;
	    },
	    easeOutQuart: function (t, b, c, d) {
	        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	    },
	    easeInOutQuart: function (t, b, c, d) {
	        if ((t /= d / 2) < 1)
	            return (c / 2) * t * t * t * t + b;
	        return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
	    },
	    easeInQuint: function (t, b, c, d) {
	        return c * (t /= d) * t * t * t * t + b;
	    },
	    easeOutQuint: function (t, b, c, d) {
	        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	    },
	    easeInOutQuint: function (t, b, c, d) {
	        if ((t /= d / 2) < 1)
	            return (c / 2) * t * t * t * t * t + b;
	        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
	    },
	    easeInSine: function (t, b, c, d) {
	        return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
	    },
	    easeOutSine: function (t, b, c, d) {
	        return c * Math.sin((t / d) * (Math.PI / 2)) + b;
	    },
	    easeInOutSine: function (t, b, c, d) {
	        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
	    },
	    easeInExpo: function (t, b, c, d) {
	        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	    },
	    easeOutExpo: function (t, b, c, d) {
	        return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
	    },
	    easeInOutExpo: function (t, b, c, d) {
	        if (t == 0)
	            return b;
	        if (t == d)
	            return b + c;
	        if ((t /= d / 2) < 1)
	            return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
	        return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
	    },
	    easeInCirc: function (t, b, c, d) {
	        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	    },
	    easeOutCirc: function (t, b, c, d) {
	        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	    },
	    easeInOutCirc: function (t, b, c, d) {
	        if ((t /= d / 2) < 1)
	            return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
	        return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	    },
	    easeInElastic: function (t, b, c, d) {
	        var s = 1.70158;
	        var p = 0;
	        var a = c;
	        if (t == 0)
	            return b;
	        if ((t /= d) == 1)
	            return b + c;
	        if (!p)
	            p = d * 0.3;
	        if (a < Math.abs(c)) {
	            a = c;
	            var s = p / 4;
	        }
	        else
	            var s = (p / (2 * Math.PI)) * Math.asin(c / a);
	        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
	    },
	    easeOutElastic: function (t, b, c, d) {
	        var s = 1.70158;
	        var p = 0;
	        var a = c;
	        if (t == 0)
	            return b;
	        if ((t /= d) == 1)
	            return b + c;
	        if (!p)
	            p = d * 0.3;
	        if (a < Math.abs(c)) {
	            a = c;
	            var s = p / 4;
	        }
	        else
	            var s = (p / (2 * Math.PI)) * Math.asin(c / a);
	        return a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) + c + b;
	    },
	    easeInOutElastic: function (t, b, c, d) {
	        var s = 1.70158;
	        var p = 0;
	        var a = c;
	        if (t == 0)
	            return b;
	        if ((t /= d / 2) == 2)
	            return b + c;
	        if (!p)
	            p = d * (0.3 * 1.5);
	        if (a < Math.abs(c)) {
	            a = c;
	            var s = p / 4;
	        }
	        else
	            var s = (p / (2 * Math.PI)) * Math.asin(c / a);
	        if (t < 1)
	            return (-0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
	        return (a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 + c + b);
	    },
	    easeInBack: function (t, b, c, d, s) {
	        if (s == undefined)
	            s = 1.70158;
	        return c * (t /= d) * t * ((s + 1) * t - s) + b;
	    },
	    easeOutBack: function (t, b, c, d, s) {
	        if (s == undefined)
	            s = 1.70158;
	        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	    },
	    easeInOutBack: function (t, b, c, d, s) {
	        if (s == undefined)
	            s = 1.70158;
	        if ((t /= d / 2) < 1)
	            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
	        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	    },
	    easeInBounce: function (t, b, c, d) {
	        return c - Easings.easeOutBounce(d - t, 0, c, d) + b;
	    },
	    easeOutBounce: function (t, b, c, d) {
	        if ((t /= d) < 1 / 2.75) {
	            return c * (7.5625 * t * t) + b;
	        }
	        else if (t < 2 / 2.75) {
	            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
	        }
	        else if (t < 2.5 / 2.75) {
	            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
	        }
	        else {
	            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
	        }
	    },
	    easeInOutBounce: function (t, b, c, d) {
	        if (t < d / 2)
	            return Easings.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
	        return Easings.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	    },
	};

	function maxMin$1(value, max) {
	    return Math.max(Math.min(value, max), 0);
	}
	const ScrollElements = [[], []];
	function optionalScroll(defaultOptions) {
	    return (options = {}) => {
	        const mappedOptions = Object.assign(Object.assign({}, defaultOptions), options);
	        const container = getElementWrapper(getElementFromQuery(mappedOptions.container), mappedOptions.horizontal);
	        const horizontal = mappedOptions.horizontal;
	        const indexedDirection = horizontal ? 1 : 0;
	        let index = ScrollElements[indexedDirection].findIndex(value => container.element === value.container.element);
	        if (index < 0) {
	            index = ScrollElements[indexedDirection].length;
	            ScrollElements[indexedDirection][index] = {
	                container: container,
	                scrollAnimation: ScrollElement(container),
	            };
	        }
	        const easing = easingFromFunction(mappedOptions.easing);
	        return Scroll(Object.assign(Object.assign({}, mappedOptions), { onStop: mappedOptions.onStop === null ? () => null : mappedOptions.onStop, onScroll: mappedOptions.onScroll === null ? () => null : mappedOptions.onScroll, scrollAnimation: ScrollElements[indexedDirection][index].scrollAnimation, container,
	            easing }));
	    };
	}
	function Scroll(options) {
	    function getRelativePosition(query) {
	        const elementRaw = getElementFromQuery(query);
	        if (elementRaw === options.container.element)
	            return options.container.scrollPosition() / scroll.getScrollSize();
	        const _element = getElementWrapper(elementRaw, options.container.horizontal);
	        return getOffset(_element) / getDiff(_element);
	    }
	    function getDistToElement(query, value = 0) {
	        const element = getElementWrapper(getElementFromQuery(query), options.container.horizontal);
	        return getOffset(element) - getDiff(element) * value;
	    }
	    function getElementSize(query, value = 1) {
	        const element = getElementWrapper(getElementFromQuery(query), options.container.horizontal);
	        return element.size() * value;
	    }
	    function scrollTo(...args) {
	        const _element = typeof args[0] === "number" ? null : args[0];
	        const value = typeof args[0] === "number" ? args[0] : args[1] || 0;
	        _element === null
	            ? _scrollToValue(maxMin$1(value, scroll.getScrollSize()))
	            : _scrollToElement(_element, value);
	    }
	    function offset(...args) {
	        const _element = typeof args[0] === "number" ? null : args[0];
	        const value = typeof args[0] === "number" ? args[0] : args[1] || 0;
	        _element === null ? _offsetValue(value) : _offsetElement(_element, value);
	    }
	    function getOffset(el) {
	        return el.relativePosition() - options.container.relativePosition() - options.container.border();
	    }
	    function getDiff(el) {
	        return scroll.getSize() - el.offset();
	    }
	    function _offsetElement(query, value = 1) {
	        const to = getElementSize(query, value);
	        _offsetValue(to);
	    }
	    function _offsetValue(value) {
	        options.scrollAnimation.create(Object.assign(Object.assign({}, options), { value: maxMin$1(value, scroll.getScrollSize()), relative: true }));
	    }
	    function _scrollToValue(value) {
	        options.scrollAnimation.create(Object.assign(Object.assign({}, options), { value, relative: false }));
	    }
	    function _scrollToElement(query, value = 0) {
	        const _element = getElementFromQuery(query);
	        const to = _element === options.container.element
	            ? scroll.getScrollSize() * value
	            : getDistToElement(_element, value) + options.container.scrollPosition();
	        _scrollToValue(to);
	    }
	    const scroll = {
	        getSize: options.container.size,
	        getScrollSize: options.container.scrollSize,
	        getScrollPosition: options.container.scrollPosition,
	        getRelativePosition,
	        getDistToElement,
	        getElementSize,
	        stop,
	        scrollTo(...args) {
	            scrollTo(...args);
	            return scroll;
	        },
	        offset: (...args) => {
	            offset(...args);
	            return scroll;
	        },
	    };
	    return Object.assign(optionalScroll(Object.assign(Object.assign({}, options), { container: options.container.element, horizontal: options.container.horizontal })), scroll);
	}
	function getElementFromQuery(elementOrQuery) {
	    if (!elementOrQuery)
	        throw new Error(`elementOrQuery should not be a ${typeof elementOrQuery}`);
	    const element = typeof elementOrQuery === "string" ? document.querySelector(elementOrQuery) : elementOrQuery;
	    if (!element)
	        throw new Error(`no element matched querySelector ${elementOrQuery}`);
	    if (element !== window && !(element instanceof HTMLElement))
	        throw new Error("element should be an instance of HTMLElement"); // TODO improve warning
	    return element === document.documentElement ? window : element;
	}

	var index = optionalScroll({
	    container: window,
	    duration: 1000,
	    easing: "easeInOutQuad",
	    horizontal: false,
	    force: false,
	    onScroll: null,
	    onStop: null
	})();

	return index;

}));
