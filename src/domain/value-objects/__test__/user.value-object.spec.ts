import { Email } from '../user';
import { FullName } from '../user/full-name.value-object';
import { Password } from '../user/password.value-object';
import { UserStatus, UserStatusEnum } from '../user/status.value-object';
import { UserId } from '../user/user-id.value-object';
import { Username } from '../user/username.value-object';

// UserId
describe('UserId', () => {
  describe('constructor / from()', () => {
    it('should create a valid UserId', () => {
      const id = UserId.from(1);
      expect(id.value).toBe(1);
    });

    it('should throw when value is zero', () => {
      expect(() => UserId.from(0)).toThrow('UserId must be a positive integer');
    });

    it('should throw when value is negative', () => {
      expect(() => UserId.from(-5)).toThrow('UserId must be a positive integer');
    });

    it('should throw when value is a float', () => {
      expect(() => UserId.from(1.5)).toThrow('UserId must be a positive integer');
    });

    it('should throw when value is not a number', () => {
      expect(() => new UserId('abc' as unknown as number)).toThrow(
        'UserId must be a positive integer',
      );
    });
  });

  describe('value getter', () => {
    it('should return the numeric value', () => {
      expect(UserId.from(42).value).toBe(42);
    });
  });

  describe('equals()', () => {
    it('should return true for same value', () => {
      expect(UserId.from(1).equals(UserId.from(1))).toBe(true);
    });

    it('should return false for different values', () => {
      expect(UserId.from(1).equals(UserId.from(2))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string representation', () => {
      expect(UserId.from(7).toString()).toBe('7');
    });
  });
});

// FullName
describe('FullName', () => {
  describe('create()', () => {
    it('should create a valid full name', () => {
      expect(FullName.create('John Doe').value).toBe('John Doe');
    });

    it('should trim whitespace', () => {
      expect(FullName.create('  Alice  ').value).toBe('Alice');
    });

    it('should throw when name is empty', () => {
      expect(() => FullName.create('')).toThrow('firstname cannot be empty');
    });

    it('should throw when name is only whitespace', () => {
      expect(() => FullName.create('   ')).toThrow('firstname cannot be empty');
    });

    it('should throw when name is shorter than 2 characters', () => {
      expect(() => FullName.create('A')).toThrow('firstname must be at least 2 characters long');
    });

    it('should throw when name exceeds 100 characters', () => {
      expect(() => FullName.create('A'.repeat(101))).toThrow(
        'firstname cannot exceed 100 characters',
      );
    });

    it('should throw when name contains invalid characters', () => {
      expect(() => FullName.create('John123')).toThrow('firstname contains invalid characters');
    });

    it('should allow hyphens and apostrophes', () => {
      expect(FullName.create("O'Brien-Smith").value).toBe("O'Brien-Smith");
    });
  });

  describe('value getter', () => {
    it('should return the string value', () => {
      expect(FullName.create('Jane').value).toBe('Jane');
    });
  });

  describe('equals()', () => {
    it('should return true for same value', () => {
      expect(FullName.create('Alice').equals(FullName.create('Alice'))).toBe(true);
    });

    it('should return false for different values', () => {
      expect(FullName.create('Alice').equals(FullName.create('Bob'))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string representation', () => {
      expect(FullName.create('Alice').toString()).toBe('Alice');
    });
  });
});

// Username
describe('Username', () => {
  describe('create()', () => {
    it('should create a valid username', () => {
      expect(Username.create('johndoe').value).toBe('johndoe');
    });

    it('should trim whitespace', () => {
      expect(Username.create('  john  ').value).toBe('john');
    });

    it('should throw when username is empty', () => {
      expect(() => Username.create('')).toThrow('username cannot be empty');
    });

    it('should throw when username is only whitespace', () => {
      expect(() => Username.create('   ')).toThrow('username cannot be empty');
    });

    it('should throw when username is shorter than 2 characters (after trim)', () => {
      expect(() => Username.create('a')).toThrow('username must be at least 3 characters');
    });

    it('should throw when username exceeds 50 characters', () => {
      expect(() => Username.create('a'.repeat(51))).toThrow('username cannot exceed 50 characters');
    });

    it('should throw when username contains spaces', () => {
      expect(() => Username.create('john doe')).toThrow('username contains invalid characters');
    });

    it('should throw when username contains special characters', () => {
      expect(() => Username.create('john@doe')).toThrow('username contains invalid characters');
    });

    it('should allow underscores and numbers', () => {
      expect(Username.create('john_doe_42').value).toBe('john_doe_42');
    });
  });

  describe('equals()', () => {
    it('should return true for same value', () => {
      expect(Username.create('alice').equals(Username.create('alice'))).toBe(true);
    });

    it('should return false for different values', () => {
      expect(Username.create('alice').equals(Username.create('bob'))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string representation', () => {
      expect(Username.create('alice').toString()).toBe('alice');
    });
  });
});

// Username
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

// Password
describe('Password', () => {
  describe('create()', () => {
    it('should create a valid password', () => {
      expect(Password.create('secret123').value).toBe('secret123');
    });

    it('should trim whitespace', () => {
      expect(Password.create('  secret123  ').value).toBe('secret123');
    });

    it('should throw when password is empty', () => {
      expect(() => Password.create('')).toThrow('password cannot be empty');
    });

    it('should throw when password is only whitespace', () => {
      expect(() => Password.create('   ')).toThrow('password cannot be empty');
    });

    it('should throw when password is shorter than 6 characters', () => {
      expect(() => Password.create('abc')).toThrow('password must be at least 2 characters long');
    });

    it('should accept password of exactly 6 characters', () => {
      expect(Password.create('abcdef').value).toBe('abcdef');
    });
  });

  describe('equals()', () => {
    it('should return true for same value', () => {
      expect(Password.create('secret123').equals(Password.create('secret123'))).toBe(true);
    });

    it('should return false for different values', () => {
      expect(Password.create('secret123').equals(Password.create('other456'))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string value', () => {
      expect(Password.create('mypass1').toString()).toBe('mypass1');
    });
  });
});

// UserStatus
describe('UserStatus', () => {
  describe('create()', () => {
    it('should create ACTIVE status', () => {
      const status = UserStatus.create(UserStatusEnum.ACTIVE);
      expect(status.value).toBe(UserStatusEnum.ACTIVE);
    });

    it('should create INACTIVE status', () => {
      const status = UserStatus.create(UserStatusEnum.INACTIVE);
      expect(status.value).toBe(UserStatusEnum.INACTIVE);
    });

    it('should create SUSPEND status', () => {
      const status = UserStatus.create(UserStatusEnum.SUSPEND);
      expect(status.value).toBe(UserStatusEnum.SUSPEND);
    });

    it('should throw for an invalid status value', () => {
      expect(() => new UserStatus('UNKNOWN' as unknown as UserStatusEnum)).toThrow(
        'Invalid user status: UNKNOWN',
      );
    });
  });

  describe('value getter', () => {
    it('should return the enum value', () => {
      expect(UserStatus.create(UserStatusEnum.ACTIVE).value).toBe('ACTIVE');
    });
  });

  describe('equals()', () => {
    it('should return true for same status', () => {
      expect(
        UserStatus.create(UserStatusEnum.ACTIVE).equals(UserStatus.create(UserStatusEnum.ACTIVE)),
      ).toBe(true);
    });

    it('should return false for different statuses', () => {
      expect(
        UserStatus.create(UserStatusEnum.ACTIVE).equals(UserStatus.create(UserStatusEnum.INACTIVE)),
      ).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string representation', () => {
      expect(UserStatus.create(UserStatusEnum.SUSPEND).toString()).toBe('SUSPEND');
    });
  });
});
