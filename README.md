# Table of Contents

- [Features](#orge2baee8)
- [Installation](#org2daf5da)
- [**Scroll**](#orgc2a387c)
  - [constructor](#org454f98d)
    - [element](#org9a07130)
    - [horizontal](#org985393d)
    - [duration](#org05664b1)
    - [easing](#org93057fa)
    - [onScroll](#orgbf8ef10)
  - [scroll](#orgf6756dd)
    - [to "position"](#orgbec0673)
    - [to "element"](#org44dff33)
  - [offset](#orgb753566)
  - [other](#org2f6d3db)
    - [stopAllAnimations](#orge6bab70)
    - [size](#orgd67007b)
    - [scrollSize](#org0e395a0)
    - [scrollPosition](#org7744e0b)
    - [getRelativeElementPosition](#orgdf5062b)
- [**Misc**](#org5fc5f49)
  - [getSize](#orgc47295f)
  - [getSizeWithBorders](#org9b7301c)
  - [getScrollPosition](#orgdd69ffa)
  - [getScrollSize](#orgf8a12da)
  - [getRelativeElementPosition](#orgece1d93)
  - [getDistToCenterElement](#org6de8946)
  - [scrollTo](#org2f84717)
- [Browser Compatibility](#org5ff5062)
- [Examples](#orgcc18640)

<a id="orge2baee8"></a>

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

<a id="org2daf5da"></a>

# Installation

From npm:

    $ npm install --save scroll-utility

From a cdn: [jsdelivr](https://www.jsdelivr.com/package/npm/scroll-utility)

    <script src="https://cdn.jsdelivr.net/npm/scroll-utility@5"></script>

when downloading from a cdn the package will be globally exported as <span class="underline">ScrollUtility</span>

<a id="orgc2a387c"></a>

# **Scroll**

The **Scroll** class is the one used to scroll

    import { Scroll } from "scroll-utility"
    // const Scroll = ScrollUtility.Scroll // from cdn

    const scrollManager = new Scroll()
    scrollManager.scroll("#some-element").offset(-50)

<a id="org454f98d"></a>

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

<a id="org9a07130"></a>

### element

    new Scroll({ element: "#container" })

The **element** option when creating a 'scrollManager' indicates the element in which the scroll will take place.
By default it will scroll normally in the page, as in **window** or in **document.documentElement**

It can be the result of **document.getElementById** or **document.querySelector**.

If it's a **string**, then it will use it as a **querySelector** with
**document.querySelector** for getting an **Element**.

You can call **document.querySelector** beforehand if you want to ensure
the element exists

<a id="org985393d"></a>

### horizontal

    new Scroll({ horizontal: true })

The **horizontal** option indicates the direction when scrolling, by default
**false**, wich means vertical scroll

<a id="org05664b1"></a>

### duration

    new Scroll({ duration: 0 })

The **duration** option indicates the default duration of the scroll animations in milliseconds, by default <span class="underline">1000ms</span>
It will be used along with [easing](#org93057fa) for creating the **smooth** animation when scrolling

If you want to disable the _smooth_ animation, set **duration** to 0.

It can be changed any time:

    const scrollManager = new Scroll({ duration: 0 })

    scrollManager.duration = 999

<a id="org93057fa"></a>

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

<a id="orgbf8ef10"></a>

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

<a id="orgf6756dd"></a>

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

<a id="orgbec0673"></a>

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
one in [constructor](#org05664b1).

**easing** is the ease animation of that scroll action. If not specified it will use the
one in [constructor](#org93057fa).

<a id="org44dff33"></a>

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
one in [constructor](#org05664b1).

**easing** is the ease animation of that scroll action. If not specified it will use the
one in [constructor](#org93057fa).

<a id="orgb753566"></a>

## offset

    const scrollManager = new Scroll()

    scrollManager.offset({
      value: 100,
      duration: 1000,
      easing: "some",
    })
    //or
    scrollManager.offset(100, 1000, "some")

<a id="org2f6d3db"></a>

## other

<a id="orge6bab70"></a>

### stopAllAnimations

To stop all scroll animations:

    const scrollManager = new Scroll()
    scrollManager.stopAllAnimations()

<a id="orgd67007b"></a>

### size

The size of the **Scroll** container

    (new Scroll()).size // size of the window
    (new Scroll("#container")).size // size of the element #container

The orientation of the value returned depends on the direction specified in the [contructor](#org985393d)

<a id="org0e395a0"></a>

### scrollSize

The total scroll you can do within the **Scroll** container

    (new Scroll()).scrollSize // scrollSize of the windows
    (new Scroll("#container")).scrollSize // scrollSize of the element #container

It's related to **scrollWidth/scrollHeight** properties of _HTMLElements_.

The orientation of the value returned depends on the direction specified in the [contructor](#org985393d)

<a id="org7744e0b"></a>

### scrollPosition

The current position of the scroll

    (new Scroll()).scrollPosition // scrollPosition of the windows
    (new Scroll("#container")).scrollPosition // scrollPosition of the element #container

For example, if you

    (new Scroll()).scroll(100)

the **scrollPosition** will be 100

The orientation of the value returned depends on the direction specified in the [contructor](#org985393d)

<a id="orgdf5062b"></a>

### getRelativeElementPosition

The relative position of certain element

    (new Scroll()).getRelativeElementPosition("#some-element")

It relates to [scroll](#org44dff33) (to "element"), so for example, if you

    (new Scroll()).scroll("#some-element", 0.5)

the relative position will be **0.5**

<a id="org5fc5f49"></a>

# **Misc**

Here I export some other useful functions.

They're meant for scroll-utility internal use, but I export them just in case someone
wouldn't want to create a **Scroll** instance to access some of it's element properties.

    import { Misc } from "scroll-utility"

    const Misc = ScrollUtility.Scroll // from cdn

<a id="orgc47295f"></a>

## getSize

Returns the size (width/height) of the element that match **element** selector

    Misc.getSize(element: string, horizontal)

    Misc.getSize(window, true)
    Misc.getSize("#container") // horizontal: false by default

<a id="org9b7301c"></a>

## getSizeWithBorders

Returns the size (including borders) of the element that match **element** selector

    Misc.getSizeWithBorders(element: string, horizontal)

    Misc.getSizeWithBorders(window, true)
    Misc.getSizeWithBorders("#container") // horizontal: false by default

<a id="orgdd69ffa"></a>

## getScrollPosition

Returns the position of the scroll (top/left)

    Misc.getScrollPosition(element: string, horizontal)

    Misc.getScrollPosition(window, true)
    Misc.getScrollPosition("#container") // horizontal: false by default

<a id="orgf8a12da"></a>

## getScrollSize

Returns equivalent of scrollWidth/scrollHeight of elements

    Misc.getScrollSize(element: string, horizontal)

    Misc.getScrollSize(window, true)
    Misc.getScrollSize("#container") // horizontal: false by default

<a id="orgece1d93"></a>

## getRelativeElementPosition

Returns the degree in which the element is centered:

- < -1: above top
- -1 < x < 0: leaving top
- 0: top
- .5: centered
- 1: bottom
- 2 > x > 1: leaving bottom
- > 2: bellow bottom

  Misc.getRelativeElementPosition(container: string, element: string, horizontal: boolean)

  Misc.getRelativeElementPosition(window, "#some-element")

<a id="org6de8946"></a>

## getDistToCenterElement

Returns the distance (in pxs) to center some element

    Misc.getDistToCenterElement(container: string, element: string, value: number, horizontal: boolean)

    Misc.getDistToCenterElement(window, "#some-element", 0) // top
    Misc.getDistToCenterElement(window, "#some-element", .5) // centered
    Misc.getDistToCenterElement(window, "#some-element", 1) // bottom

<a id="org2f84717"></a>

## scrollTo

<a id="org5ff5062"></a>

# Browser Compatibility

There are automated test for several browsers, thanks to [Browserstack](https://www.browserstack.com).  
Compatibility garanteed in all major browsers.

![img](https://3fxtqy18kygf3on3bu39kh93-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/header-logo.svg)

<a id="orgcc18640"></a>

# Examples

  <h1> hello world! </h1>
