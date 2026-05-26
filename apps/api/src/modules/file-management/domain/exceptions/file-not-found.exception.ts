export class FileNotFoundException extends Error {
  constructor(id: string) {
    super(`File not found: ${id}`);
    this.name = 'FileNotFoundException';
  }
}
