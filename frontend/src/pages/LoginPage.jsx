import { useState } from "react";

import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { signIn, signInWithGoogle, signUp } from "../services/authService";

import { ensureUserProfile } from "../services/userService";

import { getAuthErrorMessage, validateEmail } from "../utils/authErrors";



function GoogleIcon() {

  return (

    <svg

      width="22"

      height="22"

      viewBox="0 0 24 24"

      aria-hidden

      className="login-page__google-icon"

    >

      <path

        fill="#4285F4"

        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"

      />

      <path

        fill="#34A853"

        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"

      />

      <path

        fill="#FBBC05"

        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"

      />

      <path

        fill="#EA4335"

        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"

      />

    </svg>

  );

}



function LoginPage() {

  const { user, loading } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const from = location.state?.from?.pathname ?? "/progress/display";



  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState(null);



  const busy = submitting || googleLoading;



  if (loading) {

    return (

      <div className="login-page">

        <p className="login-page__loading">読み込み中...</p>

      </div>

    );

  }



  if (user) {

    return <Navigate to={from} replace />;

  }



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError(null);



    const emailError = validateEmail(email);

    if (emailError) {

      setError(emailError);

      return;

    }



    if (password.length < 6) {

      setError("パスワードは 6 文字以上で入力してください");

      return;

    }



    setSubmitting(true);



    try {

      const credential = isSignUp

        ? await signUp(email.trim(), password)

        : await signIn(email.trim(), password);



      await ensureUserProfile(

        credential.user.uid,

        credential.user.email ?? email.trim()

      );

      navigate(from, { replace: true });

    } catch (err) {

      setError(getAuthErrorMessage(err));

    } finally {

      setSubmitting(false);

    }

  };



  const handleGoogleLogin = async () => {

    setError(null);

    setGoogleLoading(true);



    try {

      const credential = await signInWithGoogle();

      await ensureUserProfile(

        credential.user.uid,

        credential.user.email ?? ""

      );

      navigate(from, { replace: true });

    } catch (err) {

      setError(getAuthErrorMessage(err));

    } finally {

      setGoogleLoading(false);

    }

  };



  return (

    <div className="login-page">

      <header className="login-page__bar">

        <Link to="/" className="login-page__logo">

          学習進捗管理

        </Link>

      </header>



      <main className="login-page__main">

        <h1 className="login-page__title">

          {isSignUp ? "新規登録" : "ログイン"}

        </h1>



        <div className="login-page__card">

          <section className="login-page__section login-page__section--social">

            <button

              type="button"

              className="login-page__social-circle"

              onClick={handleGoogleLogin}

              disabled={busy}

              aria-label="Google でログイン"

            >

              {googleLoading ? (

                <span className="login-page__spinner" aria-hidden />

              ) : (

                <GoogleIcon />

              )}

            </button>

            <span className="login-page__social-caption">Google</span>

          </section>



          <div className="login-page__rule" role="presentation" />



          <section className="login-page__section">

            <form className="login-page__form" onSubmit={handleSubmit} noValidate>

              <label className="login-page__label" htmlFor="email">

                メールアドレス

              </label>

              <input

                id="email"

                type="email"

                className="login-page__input"

                value={email}

                onChange={(e) => setEmail(e.target.value)}

                placeholder="mail@example.com"

                autoComplete="email"

                required

                disabled={busy}

              />



              <label className="login-page__label" htmlFor="password">

                パスワード

              </label>

              <input

                id="password"

                type="password"

                className="login-page__input"

                value={password}

                onChange={(e) => setPassword(e.target.value)}

                autoComplete={isSignUp ? "new-password" : "current-password"}

                minLength={6}

                required

                disabled={busy}

              />



              {error && (

                <p className="login-page__error" role="alert">

                  {error}

                </p>

              )}



              <button type="submit" className="login-page__submit" disabled={busy}>

                {submitting

                  ? "処理中..."

                  : isSignUp

                    ? "アカウントを作成"

                    : "ログイン"}

              </button>

            </form>

          </section>



          <div className="login-page__rule" role="presentation" />



          <footer className="login-page__section login-page__footer">

            {isSignUp ? (

              <p className="login-page__footer-text">

                すでにアカウントをお持ちの方は

                <button

                  type="button"

                  className="login-page__inline-link"

                  onClick={() => {

                    setIsSignUp(false);

                    setError(null);

                  }}

                >

                  ログイン

                </button>

              </p>

            ) : (

              <p className="login-page__footer-text">

                <button

                  type="button"

                  className="login-page__inline-link login-page__inline-link--block"

                  onClick={() => {

                    setIsSignUp(true);

                    setError(null);

                  }}

                >

                  会員登録はこちら

                </button>

              </p>

            )}

            <Link to="/progress/record" className="login-page__sub-link">

              ログインせずに進む

            </Link>

          </footer>

        </div>

      </main>

    </div>

  );

}



export default LoginPage;


