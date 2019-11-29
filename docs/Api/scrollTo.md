`scrollTo` is used to scroll to some element:

```js
function center(value) {
	ScrollUtility.scrollTo("#some-element", value);
}

<Template>
	<Sticky>
		{[0, 0.5, 1].map(centerValue => (
			<button key={centerValue} onClick={() => center(centerValue)}>
				Center <b>#some-element</b> at {centerValue}
			</button>
		))}
	</Sticky>
	<Element id="some-element">
		<b> #some-element </b>
	</Element>
</Template>;
```
