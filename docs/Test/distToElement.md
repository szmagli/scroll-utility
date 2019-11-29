`distToElement` test

```js
function center(value) {
	console.log(ScrollUtility.getDistToElement("#some-element", value));
}

<Template>
	<Sticky>
		{[0, 0.5, 1].map(value => (
			<Grid
				vertical={() => ScrollUtility.getDistToElement("#some-element", value)}
			/>
		))}
	</Sticky>
	<Element id="some-element">
		<b> #some-element </b>
	</Element>
</Template>;
```
