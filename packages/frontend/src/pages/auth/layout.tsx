import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      {localStorage.getItem("token") ? (
        <Navigate to="/profile" replace />
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default AuthLayout;
