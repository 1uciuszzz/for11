import { Navigate, Outlet } from "react-router-dom";
import ProfileMenu from "./menu";

const ProfileLayout = () => {
  return (
    <div className="container mx-auto flex space-x-16">
      <div>
        <ProfileMenu />
      </div>

      <div className="flex-1">
        {localStorage.getItem("token") ? (
          <Outlet />
        ) : (
          <Navigate to="/auth/signin" replace />
        )}
      </div>
    </div>
  );
};

export default ProfileLayout;
