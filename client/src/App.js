import React, {useEffect, useState} from "react";
import Routes from "./components/Routes";
import { UserIdContext } from "./components/AppContext";
import axios from "axios";

const App = () => {
  const [userId, setUserId] = useState(null);

  // async donc à chq fois que le composant est appelé, 
  // on appelle le useEffect pour contrôler le token de l'utilisateur
  useEffect(() => {
    const fetchUserId = async () => {
      await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}api/user/jwtid`,
        withCredentials: true // Permet d'envoyer les cookies avec la requête
      })
      .then((res) => {
        setUserId(res.data); // Ce qui est renvoyé par le backend est l'ID de l'utilisateur
      })
      .catch((err) => console.log("No token, Error fetching user ID:", err));
    };

    fetchUserId();
  }, []); // Les crochets contiennent userId, donc ce useEffect s'exécute à chaque fois que userId change, mais ne s'exécute qu'une seule fois et pas à l'infini

  return (
    <UserIdContext.Provider value = {userId}>
      <Routes />
    </UserIdContext.Provider>
  );
}

export default App;