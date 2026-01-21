import LogInInfo from "../components/login/loginInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../layouts/pageWrapper";
import { postLogin } from "../api/authApi";
import { setTokens } from "../utils/tokenService";

export default function LogIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoginError(false);

    if (!identifier.trim()) {
      setError("로그인 정보를 입력해주세요");
      setLoginError(true);
      return;
    }

    if (!password.trim()) {
      setError("비밀번호를 입력해주세요");
      setLoginError(true);
      return;
    }

    setIsLoading(true);

    try {
      const tokenData = await postLogin({
        credential: identifier,
        password,
      });

      // 🔑 여기서 꼭 저장해야 함
      setTokens(tokenData, false); // rememberMe 옵션 있으면 true/false로 분기

      navigate("/");
    } catch (err: any) {
      const msg =
        err instanceof Error
          ? err.message
          : "알 수 없는 로그인 오류가 발생했습니다.";
      setError(msg);
      setLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LogInInfo
        identifier={identifier}
        password={password}
        error={error}
        loginError={loginError}
        onEmailChange={setIdentifier}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        isLoading={isLoading}
      />
    </PageWrapper>
  );
}