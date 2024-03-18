import { NavLink, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { Profile } from "../types";
import { useEffect } from "react";
import { useLoadingStore } from "../stores/loading";
import ky, { HTTPError } from "ky";

const Username = () => {
  const loadingStore = useLoadingStore();

  const navigate = useNavigate();

  const [profile, setProfile] = useImmer<Profile | null>(null);

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      loadingStore.setIsLoading(true);
      const res = await ky.get(`/api/auth/profile`, {
        headers: { Authorization: token },
      });
      const profile = await res.json();
      setProfile(() => profile);
    } catch (e) {
      if (e instanceof HTTPError && e.response.status == 401) {
        localStorage.clear();
        navigate("/auth/signin");
      } else {
        console.error("Failed to get profile");
        localStorage.clear();
      }
    } finally {
      loadingStore.setIsLoading(false);
    }
  };

  const signOut = async () => {
    setProfile(() => null);
    localStorage.clear();
    navigate("/auth/signin");
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("token")]);

  return (
    <div>
      {profile ? (
        <div className="flex space-x-16 items-center">
          <NavLink to="/profile">{profile.username}</NavLink>
          <button onClick={signOut} className="btn btn-outline">
            Sign Out
          </button>
        </div>
      ) : (
        <>
          <NavLink to="/auth/signin">Sign In</NavLink>
        </>
      )}
    </div>
  );
};

export default Username;
