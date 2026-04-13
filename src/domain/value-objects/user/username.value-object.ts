export class Username {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value?.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new Error('username cannot be empty');
    }

    if (this._value.length < 2) {
      throw new Error('username must be at least 3 characters');
    }

    if (this._value.length > 50) {
      throw new Error('username cannot exceed 50 characters');
    }

    // Allow only alphanumeric characters and underscores (no spaces)
    const usernameRegex = /^[\w]+$/;
    if (!usernameRegex.test(this._value)) {
      throw new Error('username contains invalid characters');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Username): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): Username {
    return new Username(value);
  }
}
