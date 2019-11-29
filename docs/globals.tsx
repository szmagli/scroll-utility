import styled from "styled-components";
import React, { useState, useEffect } from "react";
import ScrollUtility from "../src/";

interface ITemplate {
	container: boolean;
	vertical: boolean;
	horizontal: boolean;
}

const Content = styled.div<ITemplate>(({ vertical, horizontal }) => ({
	position: "relative",
	height: vertical ?? !(horizontal ?? false) ? "200vh" : "100%",
	width: horizontal ? "200vw" : "100%"
}));

export const Template = styled(({ className, ...rest }) => (
	<div className={className} {...rest}>
		<Content {...rest} />
	</div>
))<ITemplate>(({ container, vertical, horizontal }) => ({
	overflowY: !!container && vertical ? "auto" : "initial",
	overflowX: !!container && horizontal ? "auto" : "initial"
}));

export const Element = styled.div<ITemplate>(({ horizontal, vertical }) => ({
	position: "absolute",
	top: vertical ?? !(horizontal ?? false) ? "50%" : undefined,
	left: !!horizontal ? "50%" : undefined,
	border: "3px solid black",
	width: `calc(50vw - 6px)`,
	height: `calc(50vh - 6px)`
}));

export const Sticky = styled.div<{ absolute: boolean }>(({ absolute }) => ({
	zIndex: 1,
	position: absolute ? "absolute" : "sticky",
	display: "inline-flex",
	flexDirection: "column",
	top: 0,
	left: 0,
	maxWidth: "50vw",
	maxHeight: "50vh"
}));

function gridButton(direction: string, value: number, distance: number) {
	return value === undefined ? (
		<></>
	) : (
		<>
			<button onClick={() => ScrollUtility.offset(distance)}>scroll</button>
			<label>
				{direction} <b>{value}</b>: {distance}
			</label>
		</>
	);
}

export function Grid({ vertical, horizontal }) {
	const [verticalDistance, setVerticalDistance] = useState(0);
	const [horizontalDistance, setHorizontalDistance] = useState(0);
	useEffect(() => {
		window.addEventListener("scroll", () => {
			if (horizontal !== undefined) {
				setHorizontalDistance(horizontal());
			}
			if (vertical !== undefined) {
				setVerticalDistance(vertical());
			}
		});
	});

	return (
		<div>
			{gridButton("vertical", vertical, verticalDistance)}
			{gridButton("horizontal", horizontal, horizontalDistance)}
		</div>
	);
}
