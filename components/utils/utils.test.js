const {
  getAccessToken,
  getRefreshToken,
  hashPassword,
  verifyPassword,
  verifyToken,
  getTimeDiffInMinutes,
} = require("./utils");

test("hash & verify the password", async () => {
  const plainTextPassword = "password";
  const hashedPassword = await hashPassword(plainTextPassword);
  expect(hashedPassword.length).not.toEqual(0);
  expect(await verifyPassword(plainTextPassword, hashedPassword)).toBeTruthy;
});

test("create & verify refresh token", async () => {
  const userData = {
    userName: "john doe",
    userId: "0xabcd",
  };

  // create refresh token & verify
  const refreshToken = getRefreshToken(userData);
  expect(refreshToken.length).toBeGreaterThan(0);
  const { data: decodedUserData } = verifyToken(refreshToken, "refreshToken");
  expect(decodedUserData.userId).toBe(userData.userId);

  // tamper the jwt & it should throw error
  const tamperedToken = refreshToken.split("").push("a").toString();
  const { err } = verifyToken(tamperedToken, "refreshToken");
  expect(err).not.toBeNull;
});

test("time difference between now and (5 mins + now) is greater than 4  minutes", () => {
  let date1 = Date.now();
  // adding 5 mins to current time
  let date2 = Date.now() + 5 * 60 * 1000;

  expect(getTimeDiffInMinutes(date1, date2)).toBeGreaterThan(4);
});

test("create & verify the access token", () => {
  const userData = {
    userName: "john doe",
    userId: "0xabcd",
  };

  // create refresh token
  const refreshToken = getRefreshToken(userData);

  // create access token with refresh token
  const accessToken = getAccessToken(refreshToken);
  expect(accessToken.length).toBeGreaterThan(0);

  // validate access token payload by decoding it
  const { data: decodedUserData } = verifyToken(accessToken, "accessToken");
  expect(decodedUserData.userId).toBe(userData.userId);
  expect(decodedUserData.userName).toBe(userData.userName);

  // time diff between current time and jwt ttl should be > 55 mins
  expect(
    getTimeDiffInMinutes(Date.now(), decodedUserData.exp * 1000)
  ).toBeGreaterThan(55);

  // tamper access token & verify
  const tamperedAccessToken = accessToken.split("").unshift("a").toString();
  const { err } = verifyToken(tamperedAccessToken, "accessToken");
  expect(err).not.toBeNull();
});
