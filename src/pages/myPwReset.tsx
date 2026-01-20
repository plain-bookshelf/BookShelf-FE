import MyPwResetInput from "../components/myPwReset/myPwResetInput";
import { PageWrapper } from "../layouts/pageWrapper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordByFind } from "../api/pwReset";

interface ErrorsState {
  username: string;
  nowPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ASCII_REGEX = /[^\x20-\x7F]/;
const ASCII_ERROR_MESSAGE = "영문, 숫자, 일반 특수문자만 입력 가능합니다.";

export default function MyPwReset() {
  const [username, setUsername] = useState("");
  const [nowPassword, setNowPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<ErrorsState>({
    username: "",
    nowPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // 필드별 유효성 검사
  const handleInputChangeValidation = (
    key: keyof ErrorsState,
    value: string
  ) => {
    let newError = "";

    if (ASCII_REGEX.test(value)) {
      newError = ASCII_ERROR_MESSAGE;
    }

    if (key === "username") {
      if (!value.trim()) newError = newError || "아이디를 입력하세요";
    } else if (key === "nowPassword") {
      if (!value.trim()) newError = newError || "현재 비밀번호를 입력하세요";
      else if (value.length < 8)
        newError = newError || "8자 이상 자리를 입력하세요";
    } else if (key === "newPassword") {
      if (!value.trim()) newError = newError || "새 비밀번호를 입력하세요";
      else if (value.length < 8)
        newError = newError || "8자 이상 자리를 입력하세요";
    } else if (key === "confirmPassword") {
      if (!value.trim()) {
        newError = newError || "비밀번호 확인을 입력하세요";
      } else if (newPassword !== value) {
        newError = newError || "비밀번호가 일치하지 않습니다";
      }
    }

    setErrors((prev) => ({ ...prev, [key]: newError }));
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    handleInputChangeValidation("username", value);
  };

  const handleNowPasswordChange = (value: string) => {
    setNowPassword(value);
    handleInputChangeValidation("nowPassword", value);
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

  // 전체 폼 검증
  const validateAll = (): ErrorsState => {
    const newErrors: ErrorsState = {
      username: "",
      nowPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (ASCII_REGEX.test(username)) newErrors.username = ASCII_ERROR_MESSAGE;
    if (ASCII_REGEX.test(nowPassword))
      newErrors.nowPassword = ASCII_ERROR_MESSAGE;
    if (ASCII_REGEX.test(newPassword))
      newErrors.newPassword = ASCII_ERROR_MESSAGE;
    if (ASCII_REGEX.test(confirmPassword))
      newErrors.confirmPassword = ASCII_ERROR_MESSAGE;

    if (!username.trim())
      newErrors.username = newErrors.username || "아이디를 입력하세요";

    if (!nowPassword.trim())
      newErrors.nowPassword =
        newErrors.nowPassword || "현재 비밀번호를 입력하세요";
    else if (nowPassword.length < 8)
      newErrors.nowPassword =
        newErrors.nowPassword || "8자 이상 자리를 입력하세요";

    if (!newPassword.trim())
      newErrors.newPassword =
        newErrors.newPassword || "새 비밀번호를 입력하세요";
    else if (newPassword.length < 8)
      newErrors.newPassword =
        newErrors.newPassword || "8자 이상 자리를 입력하세요";

    if (!confirmPassword.trim())
      newErrors.confirmPassword =
        newErrors.confirmPassword || "비밀번호 확인을 입력하세요";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword =
        newErrors.confirmPassword || "비밀번호가 일치하지 않습니다";

    return newErrors;
  };

  const handlePwReset = async () => {
    // 에러 초기화
    setErrors({
      username: "",
      nowPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const newErrors = validateAll();

    if (
      newErrors.username ||
      newErrors.nowPassword ||
      newErrors.newPassword ||
      newErrors.confirmPassword
    ) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordByFind(username, newPassword);

      alert("비밀번호 재설정이 완료되었습니다!");

      navigate("/showPw", { state: { resetPassword: newPassword } });
    } catch (error: unknown) {
      console.error("비밀번호 재설정 중 오류 발생", error);

      let message = "비밀번호 재설정 중 오류가 발생했습니다.";

      if (error instanceof Error) {
        if (error.message === "MEMBER_NOT_FOUND") {
          message = "회원 정보를 찾을 수 없습니다. 처음부터 다시 진행해주세요.";
        } else if (error.message === "RETOUCH_FAILED") {
          message =
            "비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해주세요.";
        } else {
          message = error.message;
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
      <MyPwResetInput
        username={username}
        nowPassword={nowPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        usernameError={errors.username}
        nowPasswordError={errors.nowPassword}
        newPasswordError={errors.newPassword}
        confirmPasswordError={errors.confirmPassword}
        isLoading={isLoading}
        handleUsernameChange={handleUsernameChange}
        handleNowPasswordChange={handleNowPasswordChange}
        handlePasswordChange={handlePasswordChange}
        handleConfirmPasswordChange={handleConfirmPasswordChange}
        onSubmit={handlePwReset}
      />
    </PageWrapper>
  );
}