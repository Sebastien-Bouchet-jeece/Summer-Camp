import React, {useEffect, useState} from "react";
import Routes from "./components/Routes";
import { UserIdContext } from "./components/AppContext";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";

const App = () => {
  const [userId, setUserId] = useState(null);

  const dispatch = useDispatch();

  // async donc à chq fois que le composant est appelé, 
  // on appelle le useEffect pour contrôler le token de l'utilisateur
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios({
          method: 'GET',
          url: `${process.env.REACT_APP_API_URL}api/user/jwtid`,
          withCredentials: true
        });
        setUserId(res.data);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.log("No token, error fetching user ID:", err);
        }
        setUserId(null);
      }
    };
    fetchUserId();
  }, []); // Les crochets contiennent userId, donc ce useEffect s'exécute à chaque fois que userId change, mais ne s'exécute qu'une seule fois et pas à l'infini

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    }
  }, [userId, dispatch]); // Run when userId or dispatch changes

  return (
    <UserIdContext.Provider value = {userId}>
      <Routes />
    </UserIdContext.Provider>
  );
}

export default App;