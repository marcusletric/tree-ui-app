import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Tree} from "./components/Tree/Tree";
import {ThemeProvider} from "styled-components";
import {theme} from "./styles/theme";
import treeData from "./mocks/tree2.json"
import {GlobalStyles} from "./styles/globalStyles";
import {debugOut} from "./mocks/tree_debug_out";
import {calcNodeDiff} from "./components/Tree/treeProcessing";

const App = () => {
    const [stepIndex, setStepIndex] = useState(0)

    const treeStates = useMemo(() => {
    return debugOut.split('-----------').map(
        state => {
          return JSON.parse(state)
        }
    );
    },[])

    const handleUserKeyPress = useCallback((ev: KeyboardEvent) => {
        if (ev.key === "ArrowLeft" && stepIndex > 0) {
            setStepIndex(stepIndex -1)
            console.log(stepIndex -1)
        }
        if (ev.key === "ArrowRight" && stepIndex < treeStates.length-1) {
            setStepIndex(stepIndex +1)
            console.log(stepIndex +1)
        }
    }, [stepIndex]);

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);


  return <ThemeProvider theme={theme}>
  <GlobalStyles />
      {stepIndex}<br/>
      DIFF: {stepIndex > 0 ? calcNodeDiff(treeStates[stepIndex-1], treeStates[stepIndex]).map(node => JSON.stringify(node)) : null}<br/>
      {/*
      STEPS: {stepIndex > 0 ? JSON.stringify(Array.from({length: stepIndex}).map((item,index) => index+1).map((step) => calcNodeDiff(treeStates[step-1], treeStates[step]))) : null}
      */}
  <Tree treeData={treeStates[stepIndex]}/>
</ThemeProvider>}


export default App;
