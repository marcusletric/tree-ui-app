import React, {FunctionComponent, PropsWithChildren, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {Vector2D} from "../Tree/types";

interface TooltipProps {

}

const StyledTooltip = styled.div<{position: Vector2D}>`
  position: absolute;
  left: ${({position}) => position.x}px;
  top: ${({position}) => position.y}px;
`
export const Tooltip : FunctionComponent<PropsWithChildren<TooltipProps>> = ({children}) => {

    const [position, setPosition] = useState<Vector2D>({x:0, y:0});

    document.onmousemove = (e) => {setPosition({x: e.x + 15, y: e.y +15})}

    return ReactDOM.createPortal(
        <StyledTooltip position={position} className='noTextSelect'>{children}</StyledTooltip>,
        document.getElementById('tooltip-root') || document.createElement('div')
    );
}