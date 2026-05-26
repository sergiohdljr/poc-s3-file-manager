export class InvalidFileSizeException extends Error {
  constructor(size: number) {
    super(`File size must be greater than 0 (received: ${size})`);
    this.name = 'InvalidFileSizeException';
  }
}
