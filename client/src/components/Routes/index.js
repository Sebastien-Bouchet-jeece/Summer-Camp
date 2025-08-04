import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import home from "../../pages/home";
import Trending from "../../pages/Trending";
import Profil from "../../pages/Profil";

const index = () => {
    return (
        <Router>
        <Switch>
            <Route exact path="/" component={home} />
            <Route path="/trending" component={Trending} />
            <Route path="/profil" component={Profil} />
        </Switch>
        </Router>
    );
}

export default index;