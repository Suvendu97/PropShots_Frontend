import React, { useState, useReducer, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
Axios.defaults.baseURL = process.env.REACT_APP_BACKEND || 'http://localhost:8000/api/v1'; 
import PostPropertyForm from "./components/PostPropertyForm";
import NewProperty from "./components/NewProperty";
import Contactus from "./components/Contactus";
import Properties from "./components/Properties";
import Sidebar from "./components/Sidebar";
import HomeOld from "./components/HomeOld";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import Shortlist from "./components/Shortlists";
import MyProperties from "./components/MyProperties";
import MoreLinks from "./components/MoreLinks";
import ComingSoon from "./components/ComingSoon";
import Home from "./components/Home";
import Filter from "./components/filter";

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("Token")),
    user: {
      token: localStorage.getItem("Token"),
    },
    states: [],
    // cities: [],
    filter: {
      typ: '',
      yr: '',
      pFor: '',
      st: '',
      ct: '',
      locality: '',
    },
    location: {
      lat: null,
      long: null
    }
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.user.token = action.data;
        draft.loggedIn = true;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "states":
        draft.states = action.data;
        return;
      case "filter":
        draft.filter.pFor = action.data.pFor;
        draft.filter.typ = action.data.typ;
        draft.filter.yr = action.data.yr;
        draft.filter.st = action.data.st;
        draft.filter.ct = action.data.ct;
        draft.filter.locality = action.data.locality;
        return;
      case "location":
        draft.location.lat = action.data.lat;
        draft.location.long = action.data.long;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    async function getStates() {
      let states = await Axios.get("/getStates");
      if (states.data) {
        dispatch({ type: 'states', data: states.data });
      }
    }
    getStates();
    if (state.loggedIn) {
      localStorage.setItem("Token", state.user.token);
    } else {
      localStorage.removeItem("Token");
    }
  }, [state.loggedIn]);

  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function checkToken() {
        try {
          let tokenresult = await Axios.post("/users/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token });
          if (!tokenresult.data) {
            dispatch({ type: "logout" });
          }
        } catch (error) {
          console.log(error);
        }
      }

      checkToken();
      return () => {
        ourRequest.cancel();
      }
    };
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {state.loggedIn ? <Sidebar /> : <></>}
          <Switch>
            <Route path="/homeold" exact>
              {state.loggedIn ? <NewProperty /> : <HomeOld />}
            </Route>
            <Route path="/post-prop" exact>
              {/* <PostPropertyForm /> */}
              <NewProperty />
            </Route>
            <Route path="/shortlist" exact>
              <Shortlist />
            </Route>
            <Route path="/more-links" exact>
              <MoreLinks />
            </Route>
            <Route path="/my-prop" exact>
              <MyProperties />
            </Route>
            <Route path="/coming-soon" exact>
              <ComingSoon />
            </Route>
            <Route path="/post-prop-old" exact>
              <PostPropertyForm />
              {/* <NewProperty /> */}
            </Route>
            <Route path="/" exact>
              {state.loggedIn ? <Properties /> : <Home />}
            </Route>
            <Route path="/filter" exact>
              {state.loggedIn ? <Filter /> : <Home />}
            </Route>
          </Switch>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
export default App;
