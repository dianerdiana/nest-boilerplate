import { UserFullName } from '../user/user-full-name.value-object';
import { UserId } from '../user/user-id.value-object';
import { UserPassword } from '../user/user-password.value-object';
import { UserStatus, UserStatusEnum } from '../user/user-status.value-object';
import { UserUsername } from '../user/user-username.value-object';

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

// UserFullName
describe('UserFullName', () => {
  describe('create()', () => {
    it('should create a valid full name', () => {
      expect(UserFullName.create('John Doe').value).toBe('John Doe');
    });

    it('should trim whitespace', () => {
      expect(UserFullName.create('  Alice  ').value).toBe('Alice');
    });

    it('should throw when name is empty', () => {
      expect(() => UserFullName.create('')).toThrow('firstname cannot be empty');
    });

    it('should throw when name is only whitespace', () => {
      expect(() => UserFullName.create('   ')).toThrow('firstname cannot be empty');
    });

    it('should throw when name is shorter than 2 characters', () => {
      expect(() => UserFullName.create('A')).toThrow(
        'firstname must be at least 2 characters long',
      );
    });

    it('should throw when name exceeds 100 characters', () => {
      expect(() => UserFullName.create('A'.repeat(101))).toThrow(
        'firstname cannot exceed 100 characters',
      );
    });

    it('should throw when name contains invalid characters', () => {
      expect(() => UserFullName.create('John123')).toThrow('firstname contains invalid characters');
    });

    it('should allow hyphens and apostrophes', () => {
      expect(UserFullName.create("O'Brien-Smith").value).toBe("O'Brien-Smith");
    });
  });

  describe('value getter', () => {
    it('should return the string value', () => {
      expect(UserFullName.create('Jane').value).toBe('Jane');
    });
  });

  describe('equals()', () => {
    it('should return true for same value', () => {
      expect(UserFullName.create('Alice').equals(UserFullName.create('Alice'))).toBe(true);
    });

    it('should return false for different values', () => {
      expect(UserFullName.create('Alice').equals(UserFullName.create('Bob'))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string representation', () => {
      expect(UserFullName.create('Alice').toString()).toBe('Alice');
    });
  });
});

// UserUsername
describe('UserUsername', () => {
  describe('create()', () => {
    it('should create a valid username', () => {
      expect(UserUsername.create('johndoe').value).toBe('johndoe');
    });

    it('should trim whitespace', () => {
      expect(UserUsername.create('  john  ').value).toBe('john');
    });

    it('should throw when username is empty', () => {
      expect(() => UserUsername.create('')).toThrow('username cannot be empty');
    });

    it('should throw when username is only whitespace', () => {
      expect(() => UserUsername.create('   ')).toThrow('username cannot be empty');
    });

    it('should throw when username is shorter than 2 characters (after trim)', () => {
      expect(() => UserUsername.create('a')).toThrow('username must be at least 3 characters');
    });

    it('should throw when username exceeds 50 characters', () => {
      expect(() => UserUsername.create('a'.repeat(51))).toThrow(
        'username cannot exceed 50 characters',
      );
    });

    it('should throw when username contains spaces', () => {
      expect(() => UserUsername.create('john doe')).toThrow('username contains invalid characters');
    });

    it('should throw when username contains special characters', () => {
      expect(() => UserUsername.create('john@doe')).toThrow('username contains invalid characters');
    });

    it('should allow underscores and numbers', () => {
      expect(UserUsername.create('john_doe_42').value).toBe('john_doe_42');
    });
  });

  describe('equals()', () => {
    it('should return true for same value', () => {
      expect(UserUsername.create('alice').equals(UserUsername.create('alice'))).toBe(true);
    });

    it('should return false for different values', () => {
      expect(UserUsername.create('alice').equals(UserUsername.create('bob'))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string representation', () => {
      expect(UserUsername.create('alice').toString()).toBe('alice');
    });
  });
});

// UserPassword
describe('UserPassword', () => {
  describe('create()', () => {
    it('should create a valid password', () => {
      expect(UserPassword.create('secret123').value).toBe('secret123');
    });

    it('should trim whitespace', () => {
      expect(UserPassword.create('  secret123  ').value).toBe('secret123');
    });

    it('should throw when password is empty', () => {
      expect(() => UserPassword.create('')).toThrow('password cannot be empty');
    });

    it('should throw when password is only whitespace', () => {
      expect(() => UserPassword.create('   ')).toThrow('password cannot be empty');
    });

    it('should throw when password is shorter than 6 characters', () => {
      expect(() => UserPassword.create('abc')).toThrow(
        'password must be at least 2 characters long',
      );
    });

    it('should accept password of exactly 6 characters', () => {
      expect(UserPassword.create('abcdef').value).toBe('abcdef');
    });
  });

  describe('equals()', () => {
    it('should return true for same value', () => {
      expect(UserPassword.create('secret123').equals(UserPassword.create('secret123'))).toBe(true);
    });

    it('should return false for different values', () => {
      expect(UserPassword.create('secret123').equals(UserPassword.create('other456'))).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the string value', () => {
      expect(UserPassword.create('mypass1').toString()).toBe('mypass1');
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
