import React, {useState, useContext, createContext} from "react";
import {client} from '../../api/client'

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [flag ,setFlag] = useState(true)
  const [role,setRole] = useState(0)
  // Wrap any rest methods we want to use making sure ...
  // ... to save the user to state.
  const signin = async (userName, password) => {
    try {
      let url = '/api/login';
      const response = await client.post("https://softforceapps.com:3000/api/login", {
        username: userName,
        password: password
      })
      /* console.log(password)
      const response = await client.post("http://localhost:8080/api/login", {
        username: userName,
        password: password
      }) */
      //console.log(response)
      setUser(response.user_id);
      setRole(response.role_id)
      return response.user_id
    } catch (error) {
      console.log(error);
      return null
    }
  };
  const wpsignin = async (nonce,auth_wp) => {
    try {
      //const response = await client.get(`https://softforceapps.com/wp-json/wp/v2/users/me`)
      /* const response = await client.get(`https://softforceapps.com/wp-json/custom/loggedinuser?_wpnonce=${nonce}`,
      {
        headers:{
          'X-WP-Nonce':nonce,
          //'Cookie':'wordpress_logged_in_e31cf72f486e719b99049dc1c8eea8cf='+auth_wp
          'Cookie':'dwqa_anonymous=Ht1jK6OvfZ4E8544MCSWUNZPb2o4ZaU9yRRmEOVtqqM; wordpress_test_cookie=WP+Cookie+check; wordpress_sec_e31cf72f486e719b99049dc1c8eea8cf=vaishnavi%7C1631856021%7CrZJHhNuat8Vybt3tj2IQgEPx6Cj3KeH0AXPumEBicp4%7C66991aed22c6e1d18f645091bb74520e534d8b31c5851750336fb4365da320b1; wordpress_logged_in_e31cf72f486e719b99049dc1c8eea8cf=vaishnavi%7C1631856021%7CrZJHhNuat8Vybt3tj2IQgEPx6Cj3KeH0AXPumEBicp4%7C9048b2c222015691facc50bfdac75c69f40d5e0b56e4c5001dfeba6f9c1c6372'
        }
      }) */
      const response = await client.post("https://softforceapps.com:3000/api/getNounce",{ "nonce":nonce ,"auth":auth_wp})
      //console.log(response)
      setFlag(false)
      setRole(response.role_id)
      setUser(response.data);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };
  const signout = () => {
    setRole(0)
    setFlag(true)
    return setUser(false);
  };
  //console.log(user)
  // Return the user object and auth methods
  return {user, flag, role, signin, wpsignin, signout};
}
const AuthContext = createContext();
export function ProvideAuth({children}) {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children} </AuthContext.Provider>
  );
}
export const useAuth = () => {
  return useContext(AuthContext);
};
