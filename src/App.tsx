import { Outlet } from "react-router-dom";
import SocketProvider from "./context/SocketProvider";

const App = () => {
  return (
    <>
      <SocketProvider>
        <Outlet />
      </SocketProvider>
    </>
  );
};

export default App;
