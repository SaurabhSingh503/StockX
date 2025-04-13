import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./screens/Home";
import Auth from "./screens/Auth";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContextFile";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { store } = useContext(AuthContext);
  return store ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


export default App;