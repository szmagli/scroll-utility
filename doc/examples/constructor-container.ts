import { Scroll } from "scroll-utility"

new Scroll(window)
new Scroll("html") // same as above

new Scroll(document.getElementById("some-element"))
new Scroll(document.querySelector("#some-element")) // same as above
new Scroll("#some-element") // same as above
