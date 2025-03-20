import { describe, it, expect, beforeAll } from 'vitest';
import { comparePassword, makeJWT, validateJWT } from './auth.js';
import { hashPassword,  } from './auth.js';
import { UserNotAuthenticatedError } from './api/errors';
import { extractBearerToken } from './auth.js';

describe('Password Hashing', () => {
    const password1 = 'correctPassword123!';
    const password2 = 'anotherPassword456!';
    let hash1: string;
    let hash2: string;
  
    beforeAll(async () => {
      hash1 = await hashPassword(password1);
      hash2 = await hashPassword(password2);
    });
  
    it('should return true for the correct password', async () => {
      const result = await comparePassword(password1, hash1);
      expect(result).toBe(true);
    });

    it('should return false for the incorrect password', async () => {
        const result = await comparePassword("wrongpassword", hash2);
        expect(result).toBe(false);
    });

    it('should return true for the correct password', async () => {
        const result = await comparePassword("correctPassword123!", hash1);
        expect(result).toBe(true);
    });

    it('should return true for the correct password', async () => {
        const result = await comparePassword(password2, hash2);
        expect(result).toBe(true);
    });

    it('should return true for the correct password', async () => {
        const result = await comparePassword(password1, hash1);
        expect(result).toBe(true);
    });
});

describe('JWT Functions', () => {
    const secret = "secret";
    const wrongsecret = "wrong_secret";
    const userId = "some-unique-user-id";
    let validToken: string;

    beforeAll(() => {
        validToken = makeJWT(userId, 3600, secret);
    });

    it('should validate a valid token', () => {
        const result = validateJWT(validToken, secret);
        expect(result).toBe(userId);
    });

    it('should throw an error for an invalid token', () => {
        expect(() => validateJWT("invalid.token", secret)).toThrow(UserNotAuthenticatedError);
    });

    it('should throw an error when the token is signet with a wrong secret', () => {
        expect(() => validateJWT(validToken, wrongsecret)).toThrow(UserNotAuthenticatedError);
    });
});


describe('extractBearerToken', () => {
    it("should extract the token from a valid header", () => {
        const token = "mysecrettoken";
        const header = "Bearer " + token;
        expect(extractBearerToken(header)).toBe(token);

    });
});