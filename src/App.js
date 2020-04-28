import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/Home";
import Biji from "./pages/Biji";
import Lianxi from "./pages/Lianxi";
import Header from "./components/Header";
import { getRequest } from "./utils/utils";
import {message} from 'antd'
message.config({
  duration: 1,
  maxCount: 3,
});
const Conatiner = styled.div`
  padding: 20px 100px;
`;
function App() {
  useEffect(() => {
    const know = window.localStorage.getItem("data");
    const types = window.localStorage.getItem("types");
    const change = window.localStorage.getItem("isChange");
    if(!know){
      getRequest.getKnows()
    }
    if(!types){
      getRequest.getTypes()
    }
    if (change) {
      getRequest.getKnows()
      getRequest.getTypes()
    };
    window.localStorage.setItem("isChange", false);
  }, []);
  return (
    <Router>
      <Header></Header>
      <Conatiner>
        <Switch>
          <Route path="/lianxi" component={Lianxi} />
          <Route path="/biji" component={Biji} />
          <Route path="/" component={Home} />
        </Switch>
      </Conatiner>
    </Router>
  );
}

export default App;
