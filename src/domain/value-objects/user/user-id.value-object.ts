export class UserId {
  private readonly _value: number;

  constructor(value: number) {
    this._value = value;
    this.validate();
  }

  private validate(): void {
    if (typeof this._value !== 'number' || !Number.isInteger(this._value) || this._value <= 0) {
      throw new Error('UserId must be a positive integer');
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
