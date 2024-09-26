import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import Profile from "./components/sidebar/profile"; // Importing Profile component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import { driverInputs } from "./formSource"; // Assuming you have inputs for drivers
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="users">
              <Route index element={<List />} />
              <Route path=":userId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
            </Route>
            <Route path="products">
              <Route index element={<List />} />
              <Route path=":productId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Product" />}
              />
            </Route>
            <Route path="drivers"> {/* New route for drivers */}
              <Route index element={<List />} /> {/* You may want to create a driver list component */}
              <Route path=":driverId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={driverInputs} title="Add New Driver" />} // Assuming you have driver inputs
              />
            </Route>
            <Route path="profile" element={<Profile />} /> {/* New route for profile */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
