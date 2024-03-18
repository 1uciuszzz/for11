import { useImmer } from "use-immer";
import { useLoadingStore } from "../../stores/loading";
import ky, { HTTPError } from "ky";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const loadingStore = useLoadingStore();

  const navigate = useNavigate();

  const [username, setUsername] = useImmer("");

  const [password, setPassword] = useImmer("");

  const signIn = async () => {
    try {
      loadingStore.setIsLoading(true);
      const res = await ky.post(`/api/auth/signin`, {
        json: { username, password },
      });
      const token = await res.text();
      localStorage.setItem("token", token);
      navigate("/");
    } catch (e) {
      if (e instanceof HTTPError && e.response.status == 401) {
        localStorage.clear();
        navigate("/auth/signin");
      } else {
        console.error("Failed to sign in");
      }
    } finally {
      loadingStore.setIsLoading(false);
    }
  };

  return (
    <div className="w-96 h-96 mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn();
        }}
        className="mockup-code"
      >
        <pre data-prefix="$">
          <code>./for11login.exe</code>
        </pre>
        <pre data-prefix=">" className="text-info">
          <code>
            Username:
            <input
              type="text"
              className="bg-inherit outline-none ml-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </code>
        </pre>
        <pre data-prefix=">" className="text-info">
          <code>
            Password:
            <input
              type="password"
              className="bg-inherit outline-none ml-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </code>
        </pre>

        <button type="submit" className="hidden">
          Sign In
        </button>

        {loadingStore.isLoading ? (
          <pre data-prefix=">">
            <code className="text-warning">Signing in...</code>
          </pre>
        ) : null}
      </form>
    </div>
  );
};

export default SignIn;
