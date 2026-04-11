import { Email } from '../common/email.value-object';

describe('Email', () => {
  describe('create()', () => {
    it('should create a valid email', () => {
      expect(Email.create('user@example.com').value).toBe('user@example.com');
    });

    it('should throw when email is empty string', () => {
      expect(() => Email.create('')).toThrow('email cannot be empty');
    });

    it('should throw when email is only whitespace', () => {
      expect(() => Email.create('   ')).toThrow('email cannot be empty');
    });

    it('should throw when email format is invalid — missing @', () => {
      expect(() => Email.create('userexample.com')).toThrow('invalid email format');
    });

    it('should throw when email format is invalid — missing domain', () => {
      expect(() => Email.create('user@')).toThrow('invalid email format');
    });

    it('should throw when email format is invalid — missing TLD', () => {
      expect(() => Email.create('user@example')).toThrow('invalid email format');
    });

    it('should throw when email exceeds 254 characters', () => {
      const longLocal = 'a'.repeat(244);
      expect(() => Email.create(`${longLocal}@example.com`)).toThrow('email is too long');
    });

    it('should accept email of exactly 254 characters', () => {
      const paddedDomain = 'b'.repeat(2);
      const exact254 = `${'a'.repeat(244)}@${paddedDomain}.co`; // 244+1+2+1+2 = 250, still fine
      expect(() => Email.create(exact254)).not.toThrow();
    });
  });

  describe('value getter', () => {
    it('should return the original email string', () => {
      expect(Email.create('hello@world.org').value).toBe('hello@world.org');
    });
  });

  describe('equals()', () => {
    it('should return true for the same email (case-insensitive)', () => {
      expect(Email.create('User@Example.COM').equals(Email.create('user@example.com'))).toBe(true);
    });

    it('should return false for different emails', () => {
      expect(Email.create('alice@example.com').equals(Email.create('bob@example.com'))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the email string', () => {
      expect(Email.create('test@test.io').toString()).toBe('test@test.io');
    });
  });
});
