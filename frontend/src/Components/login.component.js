import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import { NavLink } from "react-router-dom";

const URL = process.env.REACT_APP_BACKEND_URL;
const Login = () => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState('');

    const Submit = (e) => {
        e.preventDefault();

        Axios.post(`${URL}/users/login`, {email: inputEmail, password: inputPassword})
        .then(res => {
            const token = new Cookies();
            token.set('token', res.data.token, {path: '/', maxAge:604800 })
            //Retornar a página inicial
            window.location = "/";
        })
        .catch(() => setError("Algo deu errado. Tente Novamente."))
    }

    return(
        <div className="container form-login">
            <form className="margin box box-shadow text-dark" onSubmit={Submit}>
                <h1 className="box-title">Login</h1>
                <h4 className="form-error">{error}</h4>
                <div className="form-group">
                    <p className="form-label">Email:</p>
                    <input type="email" className="form-control" value={inputEmail} onChange = {({target: {value}}) => setInputEmail(value)} />
                </div>
                <div className="form-group">
                    <p className="form-label">Senha:</p>
                    <input type="password" className="form-control" value={inputPassword} onChange= {({target: {value}}) => setInputPassword(value)} />
                </div>
                <div className="form-group">
                    <p className = "form-label">Ainda não tem conta? <NavLink to="/register" className="link">Cadastrar</NavLink></p>
                </div>
                <div className="form-group">
                    <input type="submit"  className="form-control btn btn-dark btn-form" />
                </div>
            </form>
        </div>
    )
}

export default Login;