import { hashPassword, isValidUnencryptedValue } from '~/utils';

describe('Utils Integration Tests', () => {
  it('should hash password correctly', async () => {
    const password = 'password';
    const passwordHash = await hashPassword(password);

    expect(await isValidUnencryptedValue(password, passwordHash)).toBe(true);
  });
});
