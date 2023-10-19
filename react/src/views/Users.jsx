import { useEffect, useState } from "react"
import axiosClient from "../axios";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';


const Users = () => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)


  useEffect(() => {

    getUsers()

  }, [])

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users').then(({ data }) => {
      setUsers(data.data)
      setLoading(false)

    }).catch((err) => {
      console.log(err);
      setLoading(true)
    })
  }

  const onDelete = (u) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        // Item removal logic here
        // Call the necessary function or perform the required action to remove the item
        // Once the item is removed, you can show a success message using Swal.fire()
        axiosClient.delete(`/users/${u.id}`).then(() => {
          getUsers()
        })
        Swal.fire('Removed!', 'The item has been removed.', 'success');
      }
    });
  };



  return (
    <div>
      <div className="d-flex justify-between">
        <h2>Users</h2>
        <Link className="btn-add" to='/users/new'>Add new </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr align="center"><td>loading... </td></tr> : users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.create_at}</td>
                <td>
                  <Link className="btn  btn-edit" to={`/users/${u.id} `}>Edit</Link>
                  <button onClick={() => onDelete(u)} className="btn  btn-delete ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  )
}

export default Users
