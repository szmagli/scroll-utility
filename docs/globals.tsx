import styled from "styled-components";
import React from "react";

interface ITemplate {
	container: boolean;
	vertical: boolean;
	horizontal: boolean;
}

const Content = styled.div<ITemplate>(({ vertical, horizontal }) => ({
	height: (vertical ?? !(horizontal ?? false)) ? "200vh" : "100%",
	width: horizontal ? "200vw" : "100%",
	position: "relative"
}));

export const Template = styled(({ className, ...rest }) => (
	<div className={className} {...rest}>
		<Content {...rest} />
	</div>
))<ITemplate>(({ container, vertical, horizontal }) => ({
	height: !container && (vertical ?? !(horizontal ?? false)) ? "100vh" : "50vh",
	width: !!container && horizontal ? "100%" : "initial",
	overflowY: !!container && vertical ? "auto" : "initial",
	overflowX: !!container && horizontal ? "auto" : "initial"
}));

export const Element = styled.div<ITemplate>(
	({horizontal, vertical}) => ({
		position: "absolute",
		top: !!vertical ? "50%" : undefined,
		left: !!horizontal ? "50%" : undefined,
		border: "3px solid black",
		width: `calc(50vw - 6px)`,
		height: `calc(50vh - 6px)`,
	})
);

export const Buttons = styled.div({
	position: "sticky",
	display: "inline-flex",
	flexDirection: "column",
	top: 0,
	left: 0,
	maxWidth: "50vw",
	maxHeight: "50vh"
})
