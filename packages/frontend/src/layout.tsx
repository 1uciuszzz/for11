import { Novatrix } from "uvcanvas";
import Navigation from "./components/navigation";
import { Outlet } from "react-router-dom";
import { useLoadingStore } from "./stores/loading";
import Loader from "./components/loader";
import Footer from "./components/footer";

const Layout = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <div className="relative">
      <div className="w-full h-screen fixed -z-10">
        <Novatrix />
      </div>

      <div className="fixed top-4 left-4">{isLoading ? <Loader /> : null}</div>

      <div className="container mx-auto py-16">
        <Navigation />
      </div>

      <div>
        <Outlet />
      </div>

      <div className="container mx-auto py-16">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
