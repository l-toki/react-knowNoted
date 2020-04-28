import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import Home from "./Home";
import Biji from "./Biji";
import Lianxi from "./Lianxi";
import Header from "./Header";
import { getKnows, getTypes } from "./request";
const Conatiner = styled.div`
  padding: 20px 100px;
`;
export const GlobalChange = createContext({globalChange:false,setChange:()=>{}});
function App() {
  const [change, setChange] = useState(false);
  const setKnows = () => {
    getKnows().then((res) => {
      const unFilterData = res.data;
      let result = {};
      unFilterData.forEach((element) => {
        result[element.type]
          ? result[element.type].push(element)
          : (result[element.type] = [element]);
      });
      window.localStorage.setItem("data", JSON.stringify(result));
    });
  };
  const setTypes = () => {
    getTypes().then((res) => {
      const data = [...res.data];
      window.localStorage.setItem("types", JSON.stringify(data));
    });
  };
  useEffect(() => {
    console.log("app");
    const know = window.localStorage.getItem("data");
    const types = window.localStorage.getItem("types");
    const change = window.localStorage.getItem("isChange");
    if (!know) {
      setKnows();
    }
    if (!types) {
      setTypes();
    }
    // (!know)?setKnows():null;
    // (!types)?setTypes():null;
    if (change) {
      setKnows();
      setTypes();
    }
    setChange(false);
    window.localStorage.setItem("isChange", false);
  }, []);
  return (
    <Router>
      <Header></Header>
      <Conatiner>
        <GlobalChange.Provider value={{ globalChange: change, setChange }}>
          <Switch>
            <Route path="/lianxi" component={Lianxi} />
            <Route path="/biji" component={Biji} />
            <Route path="/" component={Home} />
          </Switch>
        </GlobalChange.Provider>
      </Conatiner>
    </Router>
  );
}

export default App;
