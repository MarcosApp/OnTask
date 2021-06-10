import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import InfoById from "../../Library/InfoById";
import UserInfo from "../../Library/UserInfo";
import ClassNavbar from "../Navbar/class.navbar";
import DefaultProfile from "../../Icons/profile.png";
const URL = process.env.REACT_APP_BACKEND_URL;

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

const Classwork = (params) => {
  const [ClassInfo, setClassInfo] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [classworks, setClassworks] = useState([]);
  const [authorInfo, setAuthorInfo] = useState({});
  const [type] = useState([
    { label: "Material", value: "material" },
    { label: "resposta curta", value: "resposta curta" },
    { label: "resposta longa", value: "resposta longa" },
    { label: "multipla escolha", value: "multipla escolha" },
    { label: "caixa de selecao", value: "caixa de selecao" },
  ]);
  const [inputType, setInputType] = useState("material");
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputDeadline, setInputDealine] = useState("");
  const [inputChoices, setChoices] = useState([]);
  const [inputNewChoices, setInputNewChoices] = useState("");

  useEffect(() => {
    const token = new Cookies().get("token");
    UserInfo(token).then((result) => {
      if (result) setUserInfo(result);
      else window.location = "/login";
    });
  }, []);

  useEffect(() => {
    const classId = params.match.params.classId;
    Axios.get(`${URL}/class/get/class/${classId}`).then((res) =>
      setClassInfo(() => res.data)
    );
  }, [params.match.params.classId]);

  useEffect(() => {
    const classId = params.match.params.classId;
    Axios.get(`${URL}/classwork/class/get/${classId}`).then((res) =>
      setClassworks(res.data)
    );
  }, [params.match.params.classId]);

  useEffect(() => {
    if (classworks.length > 0) {
      classworks.forEach((classwork) => {
        InfoById(classwork.author).then((result) =>
          setAuthorInfo((prev) => ({ ...prev, [classwork.author]: result }))
        );
      });
    }
  }, [classworks]);

  const openClasswork = () => {
    const classwork = document.getElementById("classwork");
    classwork.style.display = "block";
  };
  const closeClasswork = () => {
    const classwork = document.getElementById("classwork");
    classwork.style.display = "none";
  };

  const addNewChoice = (e) => {
    e.preventDefault();
    setChoices((choices) => [...choices, inputNewChoices]);
    setInputNewChoices("");
  };

  const createClasswork = (e) => {
    e.preventDefault();
    Axios.post(`${URL}/classwork/create`, {
      title: inputTitle,
      description: inputDescription,
      _class: ClassInfo._id,
      type: inputType,
      author: userInfo._id,
      duedate: inputDeadline,
      token: userInfo.token,
      options: inputChoices,
    }).then((result) => {
      if (inputType === "material")
        window.location = `/class/${ClassInfo._id}/m/${result.data.id}`;
      else if (inputType === "resposta curta")
        window.location = `/class/${ClassInfo._id}/sa/${result.data.id}`;
      else if (inputType === "resposta longa")
        window.location = `/class/${ClassInfo._id}/la/${result.data.id}`;
      else if (inputType === "multipla escolha")
        window.location = `/class/${ClassInfo._id}/mc/${result.data.id}`;
      else if (inputType === "caixa de selecao")
        window.location = `/class/${ClassInfo._id}/c/${result.data.id}`;
    });
  };

  return (
    <div className="container-fluid">
      <ClassNavbar classInfo={ClassInfo} />
      <div className="container">
        {Object.size(ClassInfo) > 0 &&
        userInfo !== null &&
        (ClassInfo.owner === userInfo._id ||
          ClassInfo.teacher.includes(userInfo._id)) ? (
          <button
            className="margin-top-bottom btn btn-dark add-classwork-btn"
            onClick={openClasswork}
          >
            Adicionar trabalhos de aula +
          </button>
        ) : null}
        {Object.size(authorInfo) > 0
          ? classworks.map((classwork) => {
              if (
                classwork.types !== "material" &&
                authorInfo[classwork.author]
              ) {
                return (
                  <div
                    className="box box-shadow classwork"
                    key={classwork._id}
                    onClick={() => {
                      if (classwork.types === "resposta curta")
                        window.location = `/class/${ClassInfo._id}/sa/${classwork._id}`;
                      else if (classwork.types === "resposta longa")
                        window.location = `/class/${ClassInfo._id}/la/${classwork._id}`;
                      else if (classwork.types === "multipla escolha")
                        window.location = `/class/${ClassInfo._id}/mc/${classwork._id}`;
                      else if (classwork.types === "caixa de selecao")
                        window.location = `/class/${ClassInfo._id}/c/${classwork._id}`;
                    }}
                  >
                    <h3 className="classwork-title">
                      {authorInfo[classwork.author].profile_picture ? (
                        <img
                          src={`${URL}/${
                            authorInfo[classwork.author].profile_picture
                              .filename
                          }`}
                          alt="Author"
                          className="pp"
                        />
                      ) : (
                        <img src={DefaultProfile} alt="Author" className="pp" />
                      )}
                      &nbsp;{authorInfo[classwork.author].username} postou um
                      novo{" "}
                      {classwork.types === "material" ? (
                        <span>material</span>
                      ) : (
                        <span>tarefa</span>
                      )}
                      : &nbsp;{classwork.title}
                    </h3>
                    <p>{classwork.description}</p>
                  </div>
                );
              } else return null;
            })
          : null}
      </div>
      <div className="classwork-modal" id="classwork">
        <div className="classwork-content container">
          <span className="classwork-close" onClick={closeClasswork}>
            &times;
          </span>
          <h1 className="box-title">Crie uma tarefa</h1>
          <form onSubmit={createClasswork}>
            <div className="form-group">
              <p className="form-label">Tipo da Tarefa:</p>
              <select
                className="form-control"
                onChange={({ target: { value } }) => setInputType(value)}
              >
                {type.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <p className="form-label">Título:</p>
              <input
                type="text"
                className="form-control"
                value={inputTitle}
                onChange={({ target: { value } }) => setInputTitle(value)}
                required
              />
            </div>
            <div className="form-group">
              <p className="form-label">
                Descrição{" "}
                {inputType !== "material" ? <span>(opcional)</span> : null}:
              </p>
              {inputType === "material" ? (
                <textarea
                  rows="5"
                  type="text"
                  className="form-control"
                  value={inputDescription}
                  onChange={({ target: { value } }) =>
                    setInputDescription(value)
                  }
                  required
                />
              ) : (
                <textarea
                  rows="5"
                  type="text"
                  className="form-control"
                  value={inputDescription}
                  onChange={({ target: { value } }) =>
                    setInputDescription(value)
                  }
                />
              )}
            </div>
            {inputType !== "material" ? (
              <div className="form-group">
                <p className="form-label">Data de Vencimento (opcional):</p>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={inputDeadline}
                  onChange={({ target: { value } }) => setInputDealine(value)}
                  min={new Date().toJSON().substr(0, 16)}
                />
              </div>
            ) : null}
            {inputType === "multipla escolha" ||
            inputType === "caixa de selecao" ? (
              <div className="form-group">
                <p className="form-label">Opções:</p>
                <ul>
                  {inputChoices.map((option) => {
                    return (
                      <li key={option}>
                        {option} (
                        <span
                          className="link"
                          onClick={() =>
                            setChoices(
                              inputChoices.filter(
                                (options) => options !== option
                              )
                            )
                          }
                        >
                          Deletar
                        </span>
                        )
                      </li>
                    );
                  })}
                </ul>
                <div className="box">
                  <p className="form-label">Nova opção de entrada:</p>
                  <input
                    type="text"
                    className="form-control"
                    value={inputNewChoices}
                    onChange={({ target: { value } }) =>
                      setInputNewChoices(value)
                    }
                    onKeyPress={(event) =>
                      event.key === "Enter" ? addNewChoice(event) : null
                    }
                  />
                </div>
              </div>
            ) : null}
            <div className="form-group">
              <input type="submit" className="form-control btn btn-dark" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Classwork;
