import React, { useEffect } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios'

function DefaultLayout() {

  const { user, token, notification, setToken, setUser } = useStateContext()

  if (!token) {
    return <Navigate to='/login' />
  }

  const logOut = (ev) => {
    ev.preventDefault()

    axiosClient.post('/logout').then(() => {
      setUser({})
      setToken(null)
    })
  }

  useEffect(() => {
    axiosClient.get('/user').then((data) => {
      setUser(data.data.name)
    })
  }, [])

  return (
    <div id='defaultLayout'>
      <aside>
        <Link to='/dashboard'>Dashboard</Link>
        <Link to='/users'>Users</Link>
      </aside>
      <section className="content">
        <header>
          <div>Header</div>
          <div className='d-flex'>
            {/* <span>
              {user &&
                <div>
                  {Object.keys(user).map((key) => (
                    <span key={key}>{user[key][0]}</span>
                  ))}
                </div>
              }
            </span> */}
            <a href="#" onClick={logOut} className='btn-logout'>Logout</a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </section>
      {
          notification && <div className='notification'>
          {notification}
        </div>
      }
    </div>
  )
}

export default DefaultLayout
