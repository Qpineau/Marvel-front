import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

import Header from "./components/Header";
import Characters from "./containers/Characters";
import Comics from "./containers/Comics";
import ComicsPerCharacter from "./containers/ComicsPerCharacter";
import LogIn from "./containers/LogIn";
import SignUp from "./containers/SignUp";
import Favorites from "./containers/Favorites";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
library.add(faHeart, farHeart, faTimes);

function App() {
  const [searchChar, setSearchChar] = useState("");
  const [skipChar, setSkipChar] = useState(0);
  const [searchCom, setSearchCom] = useState("");
  const [skipCom, setSkipCom] = useState(0);
  const [data, setData] = useState([]);
  const [username, setUsername] = useState(Cookies.get("username") || "");
  const [token, setToken] = useState(Cookies.get("token") || null);
  let cookie = Cookies.get("fav");
  const [fav, setFav] = useState((cookie && JSON.parse(cookie)) || [[], []]);

  // SIGNUP AND LOGIN
  const onLogin = (token, username) => {
    setToken(token);
    setUsername(username);
    Cookies.set("token", token);
    Cookies.set("username", username);
  };
  // RECHERCHE

  const handleSubmitChar = async (e, skip) => {
    e.preventDefault();
    const response = await axios.get(
      `https://marv-back.herokuapp.com/search-characters?name=${searchChar}&offset=${skip}`
    );
    setData(response.data.data);
  };

  const handleSubmitCom = async (e, skip) => {
    try {
      e.preventDefault();
      const response = await axios.get(
        `https://marv-back.herokuapp.com/search-comics?title=${searchCom}&offset=${skip}`
      );
      console.log(response.data.data);
      setData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // FAVORIS
  const addFav = (id, from) => {
    let favCopy = [...fav];
    if (from === "char") {
      if (favCopy[0].indexOf(id) === -1) {
        favCopy[0].push(id);
        alert("Favoris ajouté !");
      } else {
        alert("Déjà en favoris !");
      }
    } else if (favCopy[1].indexOf(id) === -1) {
      favCopy[1].push(id);
      alert("Favoris ajouté !");
    } else {
      alert("Déjà en favoris !");
    }

    setFav(favCopy);
    Cookies.set("fav", JSON.stringify(favCopy));
  };

  const handleRemoveFav = (id) => {
    const fav = Cookies.get("fav");
    const tabFav = fav && JSON.parse(fav);

    let newFav = [[], []];
    for (let i = 0; i < tabFav.length; i++) {
      for (let j = 0; j < tabFav[i].length; j++) {
        if (i === 0) {
          if (tabFav[i][j] !== id) {
            newFav[0].push(tabFav[i][j]);
          }
        } else {
          if (tabFav[i][j] !== id) {
            newFav[1].push(tabFav[i][j]);
          }
        }
      }
    }
    setFav(newFav);
    Cookies.set("fav", JSON.stringify(newFav));
  };

  return (
    <Router>
      <div>
        <Header
          setData={setData}
          setToken={setToken}
          token={token}
          username={username}
          setSearchChar={setSearchChar}
          setSearchCom={setSearchCom}
        />
        <Switch>
          <Route exact path="/">
            <Characters
              searchData={data}
              search={searchChar}
              setSearch={setSearchChar}
              addFav={addFav}
              handleSubmit={handleSubmitChar}
              setSkipChar={setSkipChar}
              skipChar={skipChar}
            />
          </Route>
          <Route path="/comics/:characterId">
            <ComicsPerCharacter />
          </Route>
          <Route path="/comics">
            <Comics
              addFav={addFav}
              searchData={data}
              search={searchCom}
              setSearch={setSearchCom}
              handleSubmit={handleSubmitCom}
              setSkipCom={setSkipCom}
              skipCom={skipCom}
            />
          </Route>
          <Route path="/favorites">
            <Favorites handleRemoveFav={handleRemoveFav} fav={fav} />
          </Route>
          <Route path="/log_in">
            <LogIn onLogin={onLogin} />
          </Route>
          <Route path="/sign_up">
            <SignUp onLogin={onLogin} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
