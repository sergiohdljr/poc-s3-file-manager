import { ValueObject } from '../../../../shared/domain/value-object';

export class Password extends ValueObject<string> {
  protected validate(value: string): void {
    if (value.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
  }
}
