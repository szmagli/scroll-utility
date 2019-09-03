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
    const examples = {
        Scroll: {
            container: new ScrollUtility(),
            vertical: new ScrollUtility(),
            horizontal: new ScrollUtility({ horizontal: true }),
            duration: new ScrollUtility(),
            easing: new ScrollUtility(),
            onScroll: new ScrollUtility({
                container: "#scroll-onScroll",
                onScroll: external => external && notify("external scroll detected!"),
            }),
            onStop: new ScrollUtility({
                container: "#scroll-onStop",
                onStop: () => notify("scroll ended!"),
            }),
            force: new ScrollUtility(),
            scrollToValue: new ScrollUtility(),
        },
        constructor: {
            container: (wrapper) => {
                if (!!wrapper) {
                    const container = "#container";
                    const scrollManager = examples.Scroll.container;
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
                const scrollManager = direction === "horizontal" ? examples.Scroll.horizontal : examples.Scroll.vertical;
                scrollManager.container = container;
                rp(scrollManager, container);
            },
            easing: (easing) => {
                const container = "#scroll-easings";
                const scrollManager = examples.Scroll.easing;
                scrollManager.container = container;
                rp(scrollManager, container, { easing });
            },
            duration: (duration) => {
                const container = "#scroll-duration";
                const scrollManager = examples.Scroll.duration;
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
                const scrollManager = examples.Scroll.force;
                scrollManager.container = container;
                console.log(type === "force");
                rp(scrollManager, container, {
                    duration: 2000,
                    force: type === "force",
                });
            },
        },
        scrollTo: Object.assign(() => { }, {
            element: (value) => {
                const container = "#scrollToValue";
                const element = "#scrollTo-value";
                const scrollManager = examples.Scroll.scrollToValue;
                scrollManager.container = container;
                scrollManager.scrollTo(element, value);
            },
        }),
    };
    window.example = examples;
};
