export class UserLastName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value?.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new Error('lastname cannot be empty');
    }

    if (this._value.length < 2) {
      throw new Error('lastname must be at least 2 characters long');
    }

    if (this._value.length > 100) {
      throw new Error('lastname cannot exceed 100 characters');
    }

    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(this._value)) {
      throw new Error('lastname contains invalid characters');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserLastName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): UserLastName {
    return new UserLastName(value);
  }
}
