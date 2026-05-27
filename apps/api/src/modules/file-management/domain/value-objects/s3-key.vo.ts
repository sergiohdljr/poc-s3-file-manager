import { ValueObject } from '../../../../shared/domain/value-object';

export class S3Key extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(ownerId: string, filename: string): S3Key {
    const safeName = S3Key.sanitizeFilename(filename);
    return new S3Key(`${ownerId}/${safeName}`);
  }

  static reconstitute(key: string): S3Key {
    return new S3Key(key);
  }

  protected validate(value: string): void {
    if (!value.trim()) {
      throw new Error('S3 key cannot be empty');
    }
    if (value.includes('..')) {
      throw new Error('S3 key cannot contain path traversal');
    }
  }

  private static sanitizeFilename(filename: string): string {
    const base = filename.split(/[/\\]/).pop() ?? filename;
    const sanitized = base.replace(/[^\w.\-]/g, '_').replace(/_+/g, '_');
    return sanitized || 'file';
  }
}
