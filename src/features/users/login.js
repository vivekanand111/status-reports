import React, {useState, useContext, createContext, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import {useAuth} from '../auth/use-auth'


export default function Login() {

    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();


/*     let {from} = location.state || {
        from: {
            pathname: "/"
        }
    }; */
    document.body.classList.add('Login');
    document.body.classList.remove('Dashboard')

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch({type:'EMPTY_STORE'})
    })

    let signin = (e) => {
        const userName=e.target.Username.value
        const password=e.target.Password.value
        console.log('logging in with', userName, password)

        auth.signin(userName, password).then((resp) => {
            console.log('after signin call,  resp=' + resp)
            if (resp) {
                console.log("Going to dashboard")
                history.replace('/dashboard')
            } else {
                alert('Invalid Login')
            }
        });
        e.preventDefault()
    }


    return (
        <div className="Login">
            <form onSubmit={signin}>
                <div className="login-wrap clearfix">
                    <div className="mWeb-login hidden-sm hidden-md hidden-lg">
                        <img className="img-responsive img-radius" src={
                                        require('../../images/login_icon.png').default
                                    }/>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-5 col-md-5 col-lg-5 hidden-xs">
                            <div className="mweb-img">
                                <img className="img-responsive img-radius"
                                    src={
                                        require('../../images/login-img.jpg').default
                                    }/>
                            </div>
                        </div>
                        <div className="col-xs-12  col-sm-6 col-md-6  col-lg-6 text-left pad-10">
                            <div className="col-lg-12 p-b-10 p-t-10 ">
                                <div className="login-title">
                                    <h1>Login</h1>
                                </div>
                            </div>
                            <div className="form-group clearfix">
                                <div className="col-lg-12">
                                    <label className="ladel-titel">Username / email </label>
                                </div>
                                <div className="col-lg-12">
                                    <input className="inputs-form" type="text" name="Username" />
                                </div>

                            </div>
                            <div className="form-group clearfix">
                                <div className="col-lg-12">
                                    <label className="ladel-titel">Password :</label>
                                </div>
                                <div className="col-lg-12">
                                    <input className="inputs-form" type="password" name="Password" />
                                </div>
                            </div>
                            <div className="col-lg-12 right-text">
                                <div className="mt-10">
                                    <button className="btn login-btn" type="submit"
                                        value="submit">Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
