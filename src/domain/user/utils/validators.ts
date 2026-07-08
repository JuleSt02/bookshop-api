export const passwordValidator = (password: string) => {
  const passwordRegExp = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/,
  );

  return passwordRegExp.test(password);
};

export const emaiLValidator = (email: string) => {
  const emailRegExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  return emailRegExp.test(email);
};
