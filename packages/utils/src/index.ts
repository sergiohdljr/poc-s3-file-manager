export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}
