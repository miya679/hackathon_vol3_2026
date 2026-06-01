import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import TextRegistPage from "./pages/text_regist";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import { firebaseMode } from "./lib/firebase";

import LoginPage from "./pages/LoginPage";

import ProgressRecordPage from "./pages/ProgressRecordPage";

import ProgressDisplayPage from "./pages/progress_display_slider";

import "./App.css";

function AppNav() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="app-nav">
      <NavLink
        to="/progress/display"
        className="app-nav__brand app-nav__brand--link"
      >
        学習進捗管理
      </NavLink>

      {process.env.NODE_ENV === "development" && (
        <span className="app-nav__mode" title="Firebase 接続先">
          {firebaseMode === "emulator" ? "Emulator" : "Cloud"}
        </span>
      )}

      {user && (
        <>
          <NavLink
            to="/progress/display"
            className={({ isActive }) =>
              `app-nav__link${isActive ? " app-nav__link--active" : ""}`
            }
          >
            進捗表示
          </NavLink >
          <NavLink
            to="/text/register"
            className={({ isActive }) =>
              `app-nav__link${isActive ? " app-nav__link--active" : ""}`
            }
          >
            教材登録
          </NavLink>
          <NavLink
            to="/progress/record"
            className={({ isActive }) =>
              `app-nav__link${isActive ? " app-nav__link--active" : ""}`
            }
          >
            進捗記録
          </NavLink>
        </>
      )
      }
      <span className="app-nav__spacer" />

      {!loading && user && (
        <span className="app-nav__user" title={user.email ?? ""}>
          {user.email}
        </span>
      )}

      {!loading && user ? (
        <button
          type="button"
          className="btn btn--text app-nav__logout"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      ) : (
        !loading && (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `app-nav__link${isActive ? " app-nav__link--active" : ""}`
            }
          >
            ログイン
          </NavLink>
        )
      )}
    </nav>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page">
        <p className="page-description">読み込み中...</p>
      </div>
    );
  }

  return (
    <Navigate to={user ? "/progress/display" : "/login"} replace />
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideNav = location.pathname === "/login";

  return (
    <div className={hideNav ? "app app--login-shell" : "app"}>
      {!hideNav && <AppNav />}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/mypage"
          element={<Navigate to="/progress/display" replace />}
        />

        <Route path="/progress/record" element={<ProgressRecordPage />} />

        <Route path="/progress/display" element={<ProgressDisplayPage />} />

        <Route path="/text/register" element={<TextRegistPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;