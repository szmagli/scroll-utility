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
		border: "2px solid black",
		width: left ? "50vw" : "100%",
		height: top ? "50vh" : "100%",
		...(top ? {} : {}),
		...(left ? {} : {})
	})
);

export class MyComponent extends React.Component {
	state = { value: window.innerHeight };
	componentDidMount() {
		console.log("hlelo");
		window.onresize = () => {
			console.log("hiii");
			this.setState({ value: window.innerHeight });
		};
	}
	render() {
		return <h1>{this.state.value}</h1>;
	}
}
