import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";

const Login = () => {
  const { setToken, setUser } = useStateContext();
  const [errors, setErrors] = useState(null);

  const emailRef = useRef();
  const passwordRef = useRef();
  const onSubmit = (ev) => {
    ev.preventDefault();

    const payLoad = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    setErrors(null)
    axiosClient
      .post("/login", payLoad)
      .then((data) => {
        setToken(data.data.token);
        setUser(data.data.user);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message]
            })
          }
        }
      });
  };

  return (
    <>
      <div className="form">
        <h1>Login into your account</h1>
        {
          errors && <div className="alert alert-danger">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        <form onSubmit={onSubmit}>
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <button className="btn btn-block">Login</button>
          <p className="message">
            Not Registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
