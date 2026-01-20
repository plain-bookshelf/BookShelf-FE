export interface PwResetProps {
  username: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  usernameError: string;
  newPasswordError: string;
  confirmPasswordError: string;
  handleUsernameChange: (value: string) => void
  handlePasswordChange: (value: string) => void
  handleConfirmPasswordChange: (value: string) => void
  onSubmit: () => void 
}