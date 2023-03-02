import {createGlobalStyle} from "styled-components";

export const GlobalStyles = createGlobalStyle<{}>`
  .noTextSelect {
    -webkit-user-select: none;  /* Chrome all / Safari all */
    -moz-user-select: none;     /* Firefox all */
    -ms-user-select: none;      /* IE 10+ */
    user-select: none;
  }
  
  #tooltip-root {
    pointer-events: none;
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
  }
`