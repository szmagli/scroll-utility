`scrollTo` is used to scroll to some element:

```js
import ScrollUtility from "scroll-utility";

function center(value) {
	ScrollUtility.scrollTo("#some-element", value);
}

<Template>
	<Buttons>
		{[0, 0.5, 1].map(centerValue => (
			<button key={centerValue} onClick={() => center(centerValue)}>
				Center <b>#some-element</b> at {centerValue}
			</button>
		))}
	</Buttons>
	<Element id="some-element">
		<b> #some-element </b>
	</Element>
</Template>
```
