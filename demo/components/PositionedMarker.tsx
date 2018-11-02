import * as React from "react"
import styled, { css } from "styled-components"
import { Colors } from "../colors"

export type PositionType = "position" | "percent" | "screen"

interface IProps {
  type: PositionType
  value: number
  id: string
  inverted?: boolean
}

function getSign(type: PositionType, horizontal?: boolean) {
  return type === "percent" ? "%" : type === "position" ? "px" : horizontal ? "vw" : "vh"
}

export const PositionedMarker = styled.div`
  position: absolute;
  color: ${Colors.black};
  ${(props: IProps) => css`
    top: ${`${props.value}${getSign(props.type)}`};
    left: 0;
    width: 100%;
    transform: translateY(-100%);
    white-space: nowrap;
    overflow: hidden;
  `};
`

export class PositionedElement extends React.Component<IProps> {
  render() {
    return (
      <>
        <PositionedMarker {...this.props} value={this.props.value}>
          {this.props.id}
        </PositionedMarker>
        <PositionedMarker {...this.props} value={this.props.value}>
          <div className="line" />
        </PositionedMarker>
      </>
    )
  }
}

export default PositionedElement