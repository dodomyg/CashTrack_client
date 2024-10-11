import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";


const App = () => {
  const user = true;
  return (
    <div>
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/auth" />}
        />
      </Routes>
    </div>
  );
};

export default App;
