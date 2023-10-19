import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserForm() {
  const myId = useParams().id;
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext()

  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  if (myId) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/users/${myId}`)
        .then(({ data }) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user).then(() => {
        setNotification('The user has been updated.')
        navigate('/users')

      }).catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      })
    } else {
      axiosClient.post(`/users`, user).then(() => {
        setNotification('The user has been added.')

        navigate('/users')

      }).catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      })
    }
  };

  return (
    <>
      {user.id && <h1><strong>Update User: </strong> {user.name}</h1>}
      {!user.id && <h2>New user</h2>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert alert-danger">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={user.name}
              onChange={(ev) => setUser({ ...user, name: ev.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={user.email}
              onChange={(ev) => setUser({ ...user, email: ev.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={(ev) =>
                setUser({ ...user, password: ev.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password Confirmation"
              name="password_confirmation"
              value={user.password_confirmation}
              onChange={(ev) =>
                setUser({ ...user, password_confirmation: ev.target.value })
              }
            />
            <button className="btn btn-block">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
