const {
  getAccessToken,
  getRefreshToken,
  hashPassword,
  verifyPassword,
} = require("./utils");

test("hash & verify the password", async () => {
  const plainTextPassword = "password";
  const hashedPassword = await hashPassword(plainTextPassword);
  expect(hashedPassword.length).not.toEqual(0);
  expect(await verifyPassword(plainTextPassword, hashedPassword)).toBeTruthy;
});

test("create refresh token", async () => {
  const userData = {
    userName: "john doe",
    userId: "0xabcd",
  };

  const refreshToken = await getRefreshToken(userData);
  expect(refreshToken.length).toBeGreaterThan(0);
});
