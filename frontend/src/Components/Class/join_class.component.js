import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import HomeNavbar from "../Navbar/home.navbar";
const URL = process.env.REACT_APP_BACKEND_URL;
const JoinClass = () => {
  const [inputCode, setInputCode] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [createError, setCreateError] = useState("");
  const [joinError, setJoinError] = useState("");
  const token = new Cookies().get("token");

  useEffect(() => {
    const token = new Cookies().get("token");
    UserInfo(token).then((result) => {
      if (result) setUserInfo(result);
      else window.location = "/";
    });
  }, []);

  useEffect(() => {
    if (inputTitle.length > 100)
      setCreateError("O comprimento do título deve ser menor ou igual a 100");
    else {
      if (inputDescription.length > 500)
        setCreateError(
          "O comprimento da descrição deve ser menor ou igual a 500"
        );
      else setCreateError("");
    }
  }, [inputTitle, inputDescription]);

  const openJoinTab = () => {
    document.querySelector("#join-class").style.display = "block";
    document.querySelector("#create-class").style.display = "none";
  };
  const openCreateTab = () => {
    document.querySelector("#join-class").style.display = "none";
    document.querySelector("#create-class").style.display = "block";
  };

  const CreateClass = (e) => {
    e.preventDefault();
    if (createError === "") {
      Axios.post(`${URL}/class/create`, {
        title: inputTitle,
        description: inputDescription,
        token,
        owner: userInfo._id,
      })
        .then((res) => (window.location = `/class/${res.data.classId}`))
        .catch(() => setJoinError("Algo deu errado."));
    }
  };

  const JoinClass = (e) => {
    e.preventDefault();
    if (joinError === "") {
      Axios.post(`${URL}/class/students/register`, {
        token: token,
        _class: inputCode,
        student: userInfo._id,
      })
        .then((res) => (window.location = `/class/${res.data.classId}`))
        .catch(() => setCreateError("Algo deu errado."));
    }
  };

  return (
    <div className="container-fluid">
      <HomeNavbar />
      <div className="container form-login">
        <div className="margin-top-bottom box box-shadow">
          <div className="add-classwork">
            <button className="btn btn-light" onClick={openJoinTab}>
              Entrar em uma Turma
            </button>
            <button className="btn btn-dark" onClick={openCreateTab}>
              Criar uma Turma
            </button>
          </div>
          <div className="box-text">
            <form id="join-class" onSubmit={JoinClass}>
              <h1 className="box-title">Entrar em uma turma</h1>
              <h4 className="form-error">{joinError}</h4>
              <div className="form-group">
                <p className="form-label">Codigo da Turma:</p>
                <input
                  type="text"
                  className="form-control"
                  value={inputCode}
                  onChange={({ target: { value } }) => setInputCode(value)}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control btn btn-dark btn-form"
                  type="submit"
                />
              </div>
            </form>
            <form
              id="create-class"
              className="box bg-dark text-color"
              style={{ display: "none" }}
              onSubmit={CreateClass}
            >
              <h1 className="box-title">Criar Turma</h1>
              <h4 className="form-error">{createError}</h4>
              <div className="form-group">
                <p className="form-label">Nome da Turma:</p>
                <input
                  type="text"
                  className="form-control"
                  value={inputTitle}
                  onChange={({ target: { value } }) => setInputTitle(value)}
                />
              </div>
              <div className="form-group">
                <p className="form-label">Descrição da Turma:</p>
                <textarea
                  className="form-control"
                  value={inputDescription}
                  onChange={({ target: { value } }) =>
                    setInputDescription(value)
                  }
                />
              </div>
              <div className="form-group">
                <input
                  type="submit"
                  className="form-control btn btn-light btn-form"
                  value="Criar Turma"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;
