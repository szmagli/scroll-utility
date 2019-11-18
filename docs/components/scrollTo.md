`scrollTo` is used to scroll to some element:

```js
import ScrollUtility from "scroll-utility";

function center(value) {
	ScrollUtility.scrollTo("#some-element", value);
}

<LargeScreen>
	<MyComponent />
	<button onClick={() => center(0)}>
		Center <b>#some-element</b> at 0
	</button>
	<button onClick={() => center(0.5)}>
		Center <b>#some-element</b> at 0.5
	</button>
	<button onClick={() => center(1)}>
		Center <b>#some-element</b> at 1
	</button>
	<PositionedElement id="some-element" top={"50%"}>
		<b> #some-element </b>
	</PositionedElement>
</LargeScreen>;
```
