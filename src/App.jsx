import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import AddBill from "./pages/AddBill";
import Settings from "./pages/Settings";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

const App = () => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/overview" />} />

        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/auth" />}
        >
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="add-bill" element={<AddBill />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
