export interface MyPwResetProps {
  username: string
  nowPassword: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  usernameError: string;
  nowPasswordError: string;
  newPasswordError: string;
  confirmPasswordError: string;
  handleUsernameChange: (value: string) => void
  handleNowPasswordChange: (value: string) => void
  handlePasswordChange: (value: string) => void
  handleConfirmPasswordChange: (value: string) => void
  onSubmit: () => void 
}