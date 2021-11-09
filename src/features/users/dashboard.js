import StarList from '../stars/starList'
import React from 'react'
import {useAuth} from '../auth/use-auth'
import {Redirect, useHistory, useLocation} from 'react-router-dom';
import AllReports from '../stars/allReports';

export default function Dashboard() {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  document.body.classList.add('Dashboard');
  
  if (auth.user) {
    return (
      <div className ="Dashboard">
        { auth.flag &&
          <div className="p-b-10 p-t-20 text-right">
            <button className="btn logout-btn" onClick={()=> auth.signout()}> Logout </button>        
          </div>
        }
        <br/>
        <div>
        { 
          auth.role===1 ? <StarList uid={auth.user} />: auth.role===2 ? <AllReports/> : <h2>Invalid Page </h2>
        }
        </div>
      </div>
    )
  } else {
    console.log('In dashboard, Login  context is not available')
    return <Redirect to={"/"} />
    //return null
  }
}
