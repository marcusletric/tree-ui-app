import React from 'react';
import {Tree} from "./components/Tree/Tree";
import {ThemeProvider} from "styled-components";
import {theme} from "./styles/theme";
import treeData from "./mocks/tree.json"
import {GlobalStyles} from "./styles/globalStyles";

const App = () => <ThemeProvider theme={theme}>
  <GlobalStyles />
  <Tree treeData={treeData}/>
</ThemeProvider>


export default App;
