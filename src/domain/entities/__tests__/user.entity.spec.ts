import { UserFullName, UserStatus, UserStatusEnum, UserUsername } from '../../value-objects';
import { User } from '../user.entity';

const baseCreateProps = {
  fullName: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'secret123',
};

const baseReconstituteProps = {
  ...baseCreateProps,
  id: 1,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-02'),
};

describe('User entity', () => {
  describe('User.create()', () => {
    it('should create a user without id', () => {
      const user = User.create(baseCreateProps);

      expect(user.id).toBeUndefined();
      expect(user.fullName).toBe('John Doe');
      expect(user.username).toBe('johndoe');
      expect(user.password).toBe('secret123');
    });

    it('should default status to ACTIVE when not provided', () => {
      const user = User.create(baseCreateProps);

      expect(user.status.value).toBe(UserStatusEnum.ACTIVE);
    });

    it('should use provided status', () => {
      const user = User.create({
        ...baseCreateProps,
        status: UserStatusEnum.INACTIVE,
      });

      expect(user.status.value).toBe(UserStatusEnum.INACTIVE);
    });

    it('should set createdAt and updatedAt to the same value', () => {
      const before = new Date();
      const user = User.create(baseCreateProps);
      const after = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime());
    });
  });

  describe('User.reconstitute()', () => {
    it('should reconstitute a user with id', () => {
      const user = User.reconstitute(baseReconstituteProps);

      expect(user.id).toBe(1);
      expect(user.fullName).toBe('John Doe');
      expect(user.username).toBe('johndoe');
      expect(user.password).toBe('secret123');
      expect(user.createdAt).toEqual(new Date('2026-01-01'));
      expect(user.updatedAt).toEqual(new Date('2026-01-02'));
    });

    it('should default status to ACTIVE when not provided', () => {
      const user = User.reconstitute(baseReconstituteProps);

      expect(user.status.value).toBe(UserStatusEnum.ACTIVE);
    });

    it('should use provided status', () => {
      const user = User.reconstitute({
        ...baseReconstituteProps,
        status: UserStatusEnum.SUSPEND,
      });

      expect(user.status.value).toBe(UserStatusEnum.SUSPEND);
    });
  });

  describe('getters', () => {
    it('should return undefined for id when user has no id', () => {
      const user = User.create(baseCreateProps);

      expect(user.id).toBeUndefined();
    });

    it('should return the correct id value when reconstituted', () => {
      const user = User.reconstitute(baseReconstituteProps);

      expect(user.id).toBe(1);
    });

    it('should return status as UserStatus instance', () => {
      const user = User.reconstitute(baseReconstituteProps);

      expect(user.status).toBeInstanceOf(UserStatus);
    });
  });

  describe('updateFullName()', () => {
    it('should update fullName and updatedAt', () => {
      const user = User.reconstitute(baseReconstituteProps);
      const originalUpdatedAt = user.updatedAt;
      const newFullName = UserFullName.create('Jane Doe');

      // Ensure time difference is detectable
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-01'));

      user.updateFullName(newFullName);

      expect(user.fullName).toBe('Jane Doe');
      expect(user.updatedAt).toEqual(new Date('2026-06-01'));
      expect(user.updatedAt).not.toBe(originalUpdatedAt);

      jest.useRealTimers();
    });
  });

  describe('updateUsername()', () => {
    it('should update username and updatedAt', () => {
      const user = User.reconstitute(baseReconstituteProps);
      const newUsername = UserUsername.create('janedoe');

      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-01'));

      user.updateUsername(newUsername);

      expect(user.username).toBe('janedoe');
      expect(user.updatedAt).toEqual(new Date('2026-06-01'));

      jest.useRealTimers();
    });
  });

  describe('updateStatus()', () => {
    it('should update status and updatedAt', () => {
      const user = User.reconstitute(baseReconstituteProps);
      const newStatus = UserStatus.create(UserStatusEnum.SUSPEND);

      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-01'));

      user.updateStatus(newStatus);

      expect(user.status.value).toBe(UserStatusEnum.SUSPEND);
      expect(user.updatedAt).toEqual(new Date('2026-06-01'));

      jest.useRealTimers();
    });
  });

  describe('equals()', () => {
    it('should return true for two users with the same id', () => {
      const userA = User.reconstitute(baseReconstituteProps);
      const userB = User.reconstitute(baseReconstituteProps);

      expect(userA.equals(userB)).toBe(true);
    });

    it('should return false for two users with different ids', () => {
      const userA = User.reconstitute({ ...baseReconstituteProps, id: 1 });
      const userB = User.reconstitute({ ...baseReconstituteProps, id: 2 });

      expect(userA.equals(userB)).toBe(false);
    });

    it('should return false when this user has no id', () => {
      const userA = User.create(baseCreateProps);
      const userB = User.reconstitute(baseReconstituteProps);

      expect(userA.equals(userB)).toBe(false);
    });

    it('should return false when other user has no id', () => {
      const userA = User.reconstitute(baseReconstituteProps);
      const userB = User.create(baseCreateProps);

      expect(userA.equals(userB)).toBe(false);
    });

    it('should return false when both users have no id', () => {
      const userA = User.create(baseCreateProps);
      const userB = User.create(baseCreateProps);

      expect(userA.equals(userB)).toBe(false);
    });
  });

  describe('toPersistence()', () => {
    it('should return persistence object without id when user has no id', () => {
      const user = User.create(baseCreateProps);
      const result = user.toPersistence();

      expect(result.id).toBeUndefined();
      expect(result.fullName).toBe('John Doe');
      expect(result.username).toBe('johndoe');
      expect(result.email).toBe('john@example.com');
      expect(result.password).toBe('secret123');
      expect(result.status).toBe(UserStatusEnum.ACTIVE);
    });

    it('should return persistence object with id when user has id', () => {
      const user = User.reconstitute(baseReconstituteProps);
      const result = user.toPersistence();

      expect(result.id).toBe(1);
      expect(result.fullName).toBe('John Doe');
      expect(result.username).toBe('johndoe');
      expect(result.email).toBe('john@example.com');
      expect(result.password).toBe('secret123');
      expect(result.status).toBe(UserStatusEnum.ACTIVE);
      expect(result.createdAt).toEqual(new Date('2026-01-01'));
      expect(result.updatedAt).toEqual(new Date('2026-01-02'));
    });
  });
});
