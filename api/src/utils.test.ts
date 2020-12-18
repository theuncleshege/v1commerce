import bcryptjs from 'bcryptjs';
import { mocked } from 'ts-jest/utils';

import { hashPassword, isValidUnencryptedValue } from '~/utils';

jest.mock('bcryptjs');
const mockedBcrypt = mocked(bcryptjs, true);

describe('Utils Unit Tests', () => {
  it("should call bcrypt's hash method", async () => {
    const password = 'password';
    const hashedPassword = 'passwordHashed' as never;

    const bcryptHashMethod = mockedBcrypt.hash;
    bcryptHashMethod.mockResolvedValue(hashedPassword);

    const passwordHash = await hashPassword(password);

    expect(passwordHash).toEqual(hashedPassword);

    expect(bcryptHashMethod).toHaveBeenCalledTimes(1);
    expect(bcryptHashMethod).toHaveBeenCalledWith(password, 10);
  });

  it("should call bcrypt's compare method", async () => {
    const password = 'password';
    const hashedPassword = 'passwordHashed';

    const bcryptCompareMethod = mockedBcrypt.compare;
    bcryptCompareMethod.mockResolvedValue(true as never);

    const isValid = await isValidUnencryptedValue(password, hashedPassword);

    expect(isValid).toBe(true);

    expect(bcryptCompareMethod).toHaveBeenCalledTimes(1);
    expect(bcryptCompareMethod).toHaveBeenCalledWith(password, hashedPassword);
  });
});
