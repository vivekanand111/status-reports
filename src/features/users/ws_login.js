import React from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

export default function Ws_login(props) {
   
   let auth = useAuth();
   let history = useHistory();
   //const {nonce}=useParams();
   const query=new URLSearchParams(useLocation().search);

   const nonce=query.get("_wpnonce")
   const auth_wp=query.get("auth")
   //console.log(nonce)
   //console.log(query.values().next().value)
   auth.wpsignin(nonce,auth_wp).then((resp) => {
      console.log('after signin call,  resp=' + resp)
      history.replace('/dashboard')
   });
/*   
   var uname=headers['username']
   var pass=headers['password'] */
   
/*    if(uname || pass){
      auth.signin(uname,pass).then((resp) => {
         console.log('after signin call,  resp=' + resp)
         history.replace('/dashboard')
      });
   }else{
      history.replace('/')
   }
*/  
   return (
      <>
      </>
   )
}
