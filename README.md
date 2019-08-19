# Table of Contents

- [Features](#orgd1e9b35)
- [Installation](#orgdc437c1)
- [**Scroll**](#org722a3b3)
  - [constructor](#org575260d)
    - [element](#org4dc267e)
    - [horizontal](#org466139f)
    - [duration](#org9859812)
    - [easing](#org96f2e16)
    - [onScroll](#orgbfc6bdc)
  - [scroll](#orgd7c007c)
    - [to "position"](#org4310dc7)
    - [to "element"](#orgee37ed3)
  - [offset](#orgf26bca3)
  - [other](#org6abeffd)
    - [stopAllAnimations](#org0d31b7e)
    - [size](#orgbcfb844)
    - [scrollSize](#org77aa232)
    - [scrollPosition](#orgf352875)
    - [getRelativeElementPosition](#orgfbbae56)
- [Other useful functions](#org13afa84)
- [Browser Compatibility](#orgdd32a5b)

<a id="orgd1e9b35"></a>

# Features

- Extremely powerful for scrolling to anywhere in the page, like centering
  elements to certain degree.
- Custom easing animations for scrolling
- Detect onScroll events and differentiate between user and utility scroll
- High performance
- Dependency free
- Small footprint 9.32KiB
- Typescript friendly
- Handle multiple scroll animation at the same time

<a id="orgdc437c1"></a>

# Installation

From npm:

    $ npm install --save scroll-utility

From a cdn: [jsdelivr](https://www.jsdelivr.com/package/npm/scroll-utility)

    <script src="https://cdn.jsdelivr.net/npm/scroll-utility@5"></script>

when downloading from a cdn the package will be globally exported as <span class="underline">ScrollUtility</span>

<a id="org722a3b3"></a>

# **Scroll**

The **Scroll** class is the one used to scroll

    import { Scroll } from "scroll-utility"
    // const Scroll = ScrollUtility.Scroll // from cdn

    const scrollManager = new Scroll()
    scrollManager.scroll("#some-element").offset(-50)

<a id="org575260d"></a>

## constructor

The **Scroll** constructor accepts several options:

    import Scroll from "scroll-utility";

    new Scroll({
        element?,
        horizontal?,
        duration?,
        easing?,
        onScroll?,
    }) // or
    new Scroll(element?, horizontal?, duration?, easing?, onScroll?)

Quick overview of each parameter:

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">

<colgroup>
<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">parameter</th>
<th scope="col" class="org-left">default value</th>
<th scope="col" class="org-left">type</th>
<th scope="col" class="org-left">notes</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">element</td>
<td class="org-left">window</td>
<td class="org-left">string; Window; Element</td>
<td class="org-left">element where the scroll will take place, a string means a querySelector</td>
</tr>

<tr>
<td class="org-left">horizontal</td>
<td class="org-left">false</td>
<td class="org-left">boolean</td>
<td class="org-left">direction of the scroll animation</td>
</tr>

<tr>
<td class="org-left">duration</td>
<td class="org-left">1000</td>
<td class="org-left">number</td>
<td class="org-left">default duration of scroll animations, in miliseconds</td>
</tr>

<tr>
<td class="org-left">easing</td>
<td class="org-left">"easeInOutQuad"</td>
<td class="org-left">string; (t, b, c, d) => number</td>
<td class="org-left">easing function used for scroll animations</td>
</tr>

<tr>
<td class="org-left">onScroll</td>
<td class="org-left">null</td>
<td class="org-left">null; (external?: boolean) => void</td>
<td class="org-left">callback function onscroll</td>
</tr>
</tbody>
</table>

For example, to create a horizontal **scrollManager** within "#container", with a
duration of **500ms** for its '**linear**' scroll animation, that logs **"hi"** every time
it scrolls:

    new Scroll({
        element: "#container",
        horizontal: true,
        duration: 500,
        easing: "linear",
        onScroll: () => console.log("hi"),
    })

It's also posible to pass parameters without an object

    new Scroll(
        "#container",
        true,
        500,
        "linear",
        () => console.log("hi")
    )

<a id="org4dc267e"></a>

### element

    new Scroll({ element: "#container" })

The **element** option when creating a 'scrollManager' indicates the element in which the scroll will take place.
By default it will scroll normally in the page, as in **window** or in **document.documentElement**

It can be the result of **document.getElementById** or **document.querySelector**.

If it's a **string**, then it will use it as a **querySelector** with
**document.querySelector** for getting an **Element**.

You can call **document.querySelector** beforehand if you want to ensure
the element exists

<a id="org466139f"></a>

### horizontal

    new Scroll({ horizontal: true })

The **horizontal** option indicates the direction when scrolling, by default
**false**, wich means vertical scroll

<a id="org9859812"></a>

### duration

    new Scroll({ duration: 0 })

The **duration** option indicates the default duration of the scroll animations in milliseconds, by default <span class="underline">1000ms</span>
It will be used along with [easing](#org96f2e16) for creating the **smooth** animation when scrolling

If you want to disable the _smooth_ animation, set **duration** to 0.

It can be changed any time:

    const scrollManager = new Scroll({ duration: 0 })

    scrollManager.duration = 999

<a id="org96f2e16"></a>

### easing

    new Scroll({ easing: "linear" })

The **easing** option indicates the default animation of the scroll, by default **"inOutQuad"**

Posible values are "linear" and some of the form: 'easeIn{**type**}' | "easeOut{**type**}" | "easeInOut{**type**}"; being **type**: "Quart",
"Cubic", "Bounce"&#x2026;

You can also create your own easing function:

    new Scroll({ easing: (t, b, c, d) => c / d + b })

Thats the function I use for "linear"

Learn more about easing functions [here](https://easings.net/en)

It can be changed any time:

    const scrollManager = new Scroll({ easing: "linear" })

    scrollManager.easing = "easeOutBounce"

<a id="orgbfc6bdc"></a>

### onScroll

    new Scroll({
      onScroll: (external) => {
        if (external) {
            console.log("external scroll")
        } else {
            console.log("internal scroll")
        }
      },
    })

What does it mean?, well, **external** is an attempt
It can be changed any time:

    const scrollManager = new Scroll({ onScroll: null })

    scrollManager.onScroll = () => alert("hi")

<a id="orgd7c007c"></a>

## scroll

    const scrollManager = new Scroll()

    // toPosition
    scrollManager.scroll({
        value,
        duration?,
        easing?
    }) // or
    scrollManager.scroll(value, duration?, easing?)

    // toElement
    scrollManager.scroll({
        element,
        value?,
        duration?,
        easing?
    }) // or
    scrollManager.scroll(element, value?, duration?, easing?)

<a id="org4310dc7"></a>

### to "position"

    const scrollManager = new Scroll()

    scrollManager.scroll({
      value,
      duration?,
      easing?,
    })
    //or
    scrollManager.scroll(value, duration?, easing?)

Calling **scroll** will do scroll to the position **value**: eg. **0** will do scroll
to the top of the page

**duration** is the duration of that scroll action. If not specified it will use the
one in [constructor](#org9859812).

**easing** is the ease animation of that scroll action. If not specified it will use the
one in [constructor](#org96f2e16).

<a id="orgee37ed3"></a>

### to "element"

    const scrollManager = new Scroll()

    scrollManager.scroll({
        element,
        value?,
        duration?,
        easing?,
    })
    //or
    scrollManager.scroll(element, value?, duration?, easing?)

Calling **scroll** will do scroll to the position of the element **element**, and
will center it at **value**, 0 by default. ie. the element will be at the top of
the screen

**duration** is the duration of that scroll action. If not specified it will use the
one in [constructor](#org9859812).

**easing** is the ease animation of that scroll action. If not specified it will use the
one in [constructor](#org96f2e16).

<a id="orgf26bca3"></a>

## offset

    const scrollManager = new Scroll()

    scrollManager.offset({
      value: 100,
      duration: 1000,
      easing: "some",
    })
    //or
    scrollManager.offset(100, 1000, "some")

<a id="org6abeffd"></a>

## other

<a id="org0d31b7e"></a>

### stopAllAnimations

To stop all scroll animations:

    const scrollManager = new Scroll()
    scrollManager.stopAllAnimations()

<a id="orgbcfb844"></a>

### size

The size of the **Scroll** container

    (new Scroll()).size // size of the window
    (new Scroll("#container")).size // size of the element #container

The orientation of the value returned depends on the direction specified in the [contructor](#org466139f)

<a id="org77aa232"></a>

### scrollSize

The total scroll you can do within the **Scroll** container

    (new Scroll()).scrollSize // scrollSize of the windows
    (new Scroll("#container")).scrollSize // scrollSize of the element #container

It's related to **scrollWidth/scrollHeight** properties of _HTMLElements_.

The orientation of the value returned depends on the direction specified in the [contructor](#org466139f)

<a id="orgf352875"></a>

### scrollPosition

The current position of the scroll

    (new Scroll()).scrollPosition // scrollPosition of the windows
    (new Scroll("#container")).scrollPosition // scrollPosition of the element #container

For example, if you

    (new Scroll()).scroll(100)

the **scrollPosition** will be 100

The orientation of the value returned depends on the direction specified in the [contructor](#org466139f)

<a id="orgfbbae56"></a>

### getRelativeElementPosition

The relative position of certain element

    (new Scroll()).getRelativeElementPosition("#some-element")

It relates to [scroll](#orgee37ed3) (to "element"), so for example, if you

    (new Scroll()).scroll("#some-element", 0.5)

the relative position will be **0.5**

<a id="org13afa84"></a>

# Other useful functions

<a id="orgdd32a5b"></a>

# Browser Compatibility

There are automated test for several browsers, thanks to [Browserstack](https://www.browserstack.com).

Compatibility garanteed in all major browsers.

![img](../assets/BrowserStack-logo.png)
