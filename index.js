function notify(message) {
    createNotification({
        showDuration: 1500,
        theme: "info",
    })({ message });
}
function rp(scrollManager, element, options) {
    return scrollManager.scrollTo(element, scrollManager.relativePosition(element) < 0.5 ? 1 : 0, options);
}
window.onload = () => {
    const scrollManager = new ScrollUtility();
    const examples = {
        Scroll: {
            vertical: new ScrollUtility(),
            horizontal: new ScrollUtility({ horizontal: true }),
            onScroll: new ScrollUtility({
                container: "#scroll-onScroll",
                onScroll: external => external && notify("external scroll detected!"),
            }),
            onStop: new ScrollUtility({
                container: "#scroll-onStop",
                onStop: () => notify("scroll ended!"),
            }),
        },
        constructor: {
            container: (wrapper) => {
                if (!!wrapper) {
                    const container = "#container";
                    scrollManager.container = container;
                    rp(scrollManager, container);
                }
                else {
                    const element = "#scroll-container";
                    const scrollManager = ScrollUtility.global;
                    rp(scrollManager, element);
                }
            },
            horizontal: (direction) => {
                const container = "#scroll-horizontal";
                const scrollDirection = direction === "horizontal" ? examples.Scroll.horizontal : scrollManager;
                scrollManager.container = container;
                rp(scrollDirection, container);
            },
            easing: (easing) => {
                const container = "#scroll-easings";
                scrollManager.container = container;
                rp(scrollManager, container, { easing });
            },
            duration: (duration) => {
                const container = "#scroll-duration";
                scrollManager.container = container;
                rp(scrollManager, container, { duration });
            },
            onScroll: () => {
                const container = "#scroll-onScroll";
                const scrollManager = examples.Scroll.onScroll;
                scrollManager.container = container;
                rp(scrollManager, container);
            },
            onStop: () => {
                const container = "#scroll-onStop";
                const scrollManager = examples.Scroll.onStop;
                scrollManager.container = container;
                rp(scrollManager, container);
            },
            force: (type) => {
                const container = "#scroll-force";
                scrollManager.container = container;
                rp(scrollManager, container, {
                    duration: 2000,
                    force: type === "force",
                });
            },
        },
        scrollTo: Object.assign(value => {
            const container = "#scrollTo";
            scrollManager.container = container;
            scrollManager.scrollTo(value);
        }, {
            element: (value) => {
                const container = "#example-scrollToElement";
                const element = "#scrollTo-element";
                scrollManager.container = container;
                scrollManager.scrollTo(element, value);
            },
            value: (value) => {
                const container = "#scrollToValue";
                scrollManager.container = container;
                scrollManager.scrollTo(value);
            },
        }),
        offset: Object.assign(value => {
            const container = "#offset";
            scrollManager.container = container;
            scrollManager.offset(value);
        }, {
            element: (value) => {
                const container = "#offsetElement";
                scrollManager.container = container;
                scrollManager.offset(container, value);
                scrollManager.elementSize;
            },
            value: (value) => {
                const container = "#offsetValue";
                scrollManager.container = container;
                scrollManager.offset(value);
            },
        }),
        scrollPosition: () => {
            const container = "#scrollPosition";
            scrollManager.container = container;
            notify(scrollManager.scrollPosition.toString());
        },
        size: () => {
            const container = "#size";
            scrollManager.container = container;
            notify(scrollManager.size.toString());
        },
        scrollSize: () => {
            const container = "#scrollSize";
            scrollManager.container = container;
            notify(scrollManager.scrollSize.toString());
        },
        relativePosition: (value) => {
            const container = "#relativePosition";
            const element = "#relativePosition-element";
            scrollManager.container = container;
            value !== undefined
                ? scrollManager.scrollTo(element, value)
                : notify(scrollManager.relativePosition(element).toString());
        },
        distToElement: (value) => {
            const container = "#distToElement";
            const element = "#distToElement-element";
            scrollManager.container = container;
            notify(scrollManager.distToElement(element, value).toString());
        },
        stop: (stop) => {
            const container = "#stop";
            scrollManager.container = container;
            if (stop) {
                scrollManager.stop();
            }
            else {
                rp(scrollManager, container, { duration: 2000 });
            }
        },
    };
    window.example = examples;
};
