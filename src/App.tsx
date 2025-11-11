import { Outlet } from "react-router-dom";
import SocketProvider from "./context/SocketProvider";
import ToastContainer from "./components/UI/ToastContainer";

const App = () => {
  return (
    <>
      <SocketProvider>
        <Outlet />
        <ToastContainer />
      </SocketProvider>
    </>
  );
};

export default App;
