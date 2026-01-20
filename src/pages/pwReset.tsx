import PwResetInput from "../components/pwReset/pwResetInput";
import { PageWrapper } from "../layouts/pageWrapper";
import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { resetPasswordByFind } from "../api/pwReset";

interface ErrorsState {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PwReset() {
  const ASCII_REGEX = /[^\x20-\x7F]/g;
  const ASCII_ERROR_MESSAGE = "영문, 숫자, 일반 특수문자만 입력 가능합니다.";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<ErrorsState>({
    username: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  // const location = useLocation();


  // 입력 변경 시 필드별 유효성 검사
  const handleInputChangeValidation = (
    key: keyof ErrorsState,
    value: string) => {
    let newError = "";

    // 1. ASCII 범위 외 문자 체크
    if (ASCII_REGEX.test(value)) {
      newError = ASCII_ERROR_MESSAGE;
    }

    // 2. 필드별 유효성 검사
    if(key === "username"){
      if(!value.trim()){
        newError = newError || "아이디를 입력하세요";
      }
    }else if (key === "newPassword") {
      if (!value.trim()) {
        newError = newError || "비밀번호를 입력하세요";
      } else if (value.length < 8) {
        newError = newError || "8자 이상 자리를 입력하세요";
      }
    } else if (key === "confirmPassword") {
      if (!value.trim()) {
        newError = newError || "비밀번호 확인을 입력하세요";
      } else if (newPassword !== value) {
        newError = newError || "비밀번호가 일치하지 않습니다";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [key]: newError,
    }));
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    handleInputChangeValidation("username", value);
  };
  
  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    handleInputChangeValidation("newPassword", value);

    if (confirmPassword.trim()) {
      handleInputChangeValidation("confirmPassword", confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    handleInputChangeValidation("confirmPassword", value);
  };

  const handlePwReset = async () => {

    // 에러 초기화
    setErrors({ username: "", newPassword: "", confirmPassword: "" });

    const newErrors: ErrorsState = {
      username: "",
      newPassword: "",
      confirmPassword: "",
    };

    // 1. ASCII 체크
    if (ASCII_REGEX.test(username)) {
      newErrors.username = ASCII_ERROR_MESSAGE;
    }
    if (ASCII_REGEX.test(newPassword)) {
      newErrors.newPassword = ASCII_ERROR_MESSAGE;
    }
    if (ASCII_REGEX.test(confirmPassword)) {
      newErrors.confirmPassword = ASCII_ERROR_MESSAGE;
    }

    // 2. 기본 유효성 검사
    if (!username.trim()){
      newErrors.username = newErrors.username || "아이디를 입력하세요";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword =
        newErrors.newPassword || "비밀번호를 입력하세요";
    } else if (newPassword.length < 8) {
      newErrors.newPassword =
        newErrors.newPassword || "8자 이상 자리를 입력하세요";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword =
        newErrors.confirmPassword || "비밀번호 확인을 입력하세요";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword =
        newErrors.confirmPassword || "비밀번호가 일치하지 않습니다";
    }

    // 에러 있으면 종료
    if (newErrors.username || newErrors.newPassword || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      //  실제 서버 호출
      await resetPasswordByFind(username, newPassword);

      alert("비밀번호 재설정이 완료되었습니다!");

      // 완료 페이지로 이동 (기존 로직 유지)
      navigate("/showPw", {
        state: { resetPassword: newPassword },
      });
    } catch (err) {
      console.error("비밀번호 재설정 중 오류 발생", err);

      let message = "비밀번호 재설정 중 오류가 발생했습니다.";

      if (err instanceof Error) {
        if (err.message === "MEMBER_NOT_FOUND") {
          message =
            "회원 정보를 찾을 수 없습니다. 처음부터 다시 진행해주세요.";
        } else if (err.message === "RETOUCH_FAILED") {
          message =
            "비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해주세요.";
        } else {
          message = err.message;
        }
      }

      setErrors((prev) => ({
        ...prev,
        newPassword: message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <PwResetInput
        username={username}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        isLoading={isLoading}
        usernameError={errors.username}
        newPasswordError={errors.newPassword}
        confirmPasswordError={errors.confirmPassword}
        handleUsernameChange={handleUsernameChange}
        handlePasswordChange={handlePasswordChange}
        handleConfirmPasswordChange={handleConfirmPasswordChange}
        onSubmit={handlePwReset}
      />
    </PageWrapper>
  );
}