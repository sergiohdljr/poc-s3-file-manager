import { ValueObject } from '../../../../shared/domain/value-object';

export class Email extends ValueObject<string> {
  protected validate(value: string): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error(`Invalid email: ${value}`);
    }
  }
}
