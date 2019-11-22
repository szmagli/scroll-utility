import styled from "styled-components";
import React from "react";

export const LargeScreen = styled.div<{ element: string }>(({ element }) => ({
	height: "200vh",
	position: "relative"
}));

export const PositionedElement = styled.div<{ top: string; left: string }>(
	({ top, left }) => ({
		position: "absolute",
		top,
		left,
		border: "3px solid black",
		width: left ? "50vw" : "100%",
		height: top ? "50vh" : "100%",
		...(top ? {} : {}),
		...(left ? {} : {})
	})
);

export class MyComponent extends React.Component {
	componentDidMount() {
		window.onresize = () => {
			this.forceUpdate();
		};
	}
	render() {
		return (
			<>
				<h1>innerHeight: {window.innerHeight}</h1>
				<h1>
					documentElement.clientHeight: {document.documentElement.clientHeight}
				</h1>
				<h1>document.body.clientHeight: {document.body.clientHeight}</h1>
			</>
		);
	}
}
