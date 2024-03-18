import ky, { HTTPError } from "ky";
import { useLoadingStore } from "../../stores/loading";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import {
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { AccountStatistics, Profile } from "../../types";
import { useNavigate } from "react-router-dom";
import Infomation from "../../components/infomation";
import EditableInfo from "../../components/editableInfo";

const ProfileInfo = () => {
  const navigate = useNavigate();

  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const [profile, setProfile] = useImmer<Profile | null>(null);

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      const res = await ky.get("/api/profiles", {
        headers: { Authorization: token },
      });
      const data: Profile = await res.json();
      setProfile(data);
    } catch (e) {
      if (e instanceof HTTPError && e.response.status == 401) {
        localStorage.clear();
        navigate("/auth/signin");
      } else {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [editable, setEditable] = useImmer<boolean>(false);

  const handleChange = (key: keyof Profile, value: string | number) => {
    setProfile((profile) => {
      if (profile) {
        return { ...profile, [key]: value };
      }
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      const res = await ky.patch("/api/profiles", {
        json: profile,
        headers: { Authorization: token },
      });
      const data: Profile = await res.json();
      setProfile(data);
      setEditable(false);
    } catch (e) {
      if (e instanceof HTTPError && e.response.status == 401) {
        localStorage.clear();
        navigate("/auth/signin");
      } else {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card backdrop-blur-xl shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          Profile
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setEditable(!editable)}
          >
            📝
          </button>
          {editable ? (
            <button className="btn btn-ghost btn-circle" onClick={handleSave}>
              ✅
            </button>
          ) : null}
          {editable ? null : (
            <button className="btn btn-ghost btn-circle" onClick={getProfile}>
              🔃
            </button>
          )}
        </h2>
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Infomation label="User ID" value={profile?.userId} />
          <Infomation
            label="Create At"
            value={
              profile?.createdAt && new Date(+profile?.createdAt).toDateString()
            }
          />
          <EditableInfo
            label="First Name"
            value={profile?.firstName}
            editable={editable}
            type="text"
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
          <EditableInfo
            label="Last Name"
            value={profile?.lastName}
            editable={editable}
            type="text"
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
          <EditableInfo
            label="Email"
            value={profile?.email}
            editable={editable}
            type="text"
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <EditableInfo
            label="Phone"
            value={profile?.phone}
            editable={editable}
            type="text"
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <EditableInfo
            label="Company"
            value={profile?.company}
            editable={editable}
            type="text"
            onChange={(e) => handleChange("company", e.target.value)}
          />
          <EditableInfo
            label="Salary"
            value={profile?.salary}
            editable={editable}
            type="number"
            onChange={(e) => handleChange("salary", +e.target.value)}
          />
          <EditableInfo
            label="Pay Day"
            value={profile?.payday}
            editable={editable}
            type="number"
            onChange={(e) => handleChange("payday", +e.target.value)}
          />
          <EditableInfo
            label="Birthday"
            value={
              profile?.birthday &&
              new Date(+profile.birthday).toISOString().split("T")[0]
            }
            editable={editable}
            type="date"
            onChange={(e) =>
              handleChange(
                "birthday",
                new Date(e.target.value).getTime().toString()
              )
            }
          />
          <Infomation
            label="Age"
            value={
              profile?.birthday &&
              new Date().getFullYear() -
                new Date(+profile?.birthday).getFullYear()
            }
          />
          <button type="submit" hidden></button>
        </form>
      </div>
    </div>
  );
};

const AccountsStatistics = () => {
  const navigate = useNavigate();

  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const [year, setYear] = useImmer<number>(new Date().getFullYear());

  const [month, setMonth] = useImmer<string>("");

  const [statistics, setStatistics] = useImmer<AccountStatistics[]>([]);

  const getStatistics = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      const res = await ky.get("/api/accounts/statistics", {
        searchParams: {
          year,
          month: month ? new Date(month).getMonth() + 1 : "",
        },
        headers: { Authorization: token },
      });
      const data: AccountStatistics[] = await res.json();
      setStatistics(data);
    } catch (e) {
      if (e instanceof HTTPError && e.response.status == 401) {
        localStorage.clear();
        navigate("/auth/signin");
      } else {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  return (
    <div className="card backdrop-blur-xl shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Accounts Statistics</h2>
        <div className="flex flex-col space-y-16">
          <div className="flex space-x-16">
            <input
              className="input bg-transparent input-bordered w-32"
              type="number"
              min={2000}
              max={2099}
              step={1}
              value={year}
              onChange={(e) => setYear(+e.target.value)}
            />
            <input
              type="month"
              className="input bg-transparent input-bordered w-64"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statistics}>
                <Line type="monotone" dataKey="value" strokeWidth={4} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="flex flex-col space-y-16">
      <ProfileInfo />
      <AccountsStatistics />
    </div>
  );
};

export default ProfilePage;
