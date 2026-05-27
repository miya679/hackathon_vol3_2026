import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import ProgressRecordPage from "./pages/ProgressRecordPage";
import { firebaseMode } from "./lib/firebase";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="app-nav">
          <span className="app-nav__brand">学習進捗管理</span>
          {process.env.NODE_ENV === "development" && (
            <span className="app-nav__mode" title="Firebase 接続先">
              {firebaseMode === "emulator" ? "Emulator" : "Cloud"}
            </span>
          )}
          <NavLink
            to="/progress/record"
            className={({ isActive }) =>
              `app-nav__link${isActive ? " app-nav__link--active" : ""}`
            }
          >
            進捗記録
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/progress/record" replace />} />
          <Route path="/progress/record" element={<ProgressRecordPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
