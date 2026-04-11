export class UserId {
  private readonly _value: number;

  constructor(value: number) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
      throw new Error('UserId must be a positive integer');
    }

    this._value = value;
    this.validate();
  }

  private validate(): void {
    if (!this._value) {
      throw new Error('UserId cannot be empty');
    }
  }

  get value(): number {
    return this._value;
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return String(this._value);
  }

  static from(value: number): UserId {
    return new UserId(value);
  }
}
