import { Navigate, Outlet } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"

function GuestLayout() {
  const { token } = useStateContext()

  if (token) {
    return <Navigate to='/users' />
  }


  return (
    <div id="guestLayout">
      <div className="login-signup-form animated fadeInDown ">
        <Outlet />

      </div>
    </div>
  )
}

export default GuestLayout
