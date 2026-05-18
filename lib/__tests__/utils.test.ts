import { describe, it, expect } from 'vitest';
import { sanitizeRedirectTo } from '../utils';

describe('sanitizeRedirectTo', () => {
  it('returns null for undefined', () => {
    expect(sanitizeRedirectTo(undefined)).toBeNull();
  });

  it('returns null for null', () => {
    expect(sanitizeRedirectTo(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(sanitizeRedirectTo('')).toBeNull();
  });

  it('returns the value for a simple relative path', () => {
    expect(sanitizeRedirectTo('/comunidad')).toBe('/comunidad');
  });

  it('returns the value for a nested relative path', () => {
    expect(sanitizeRedirectTo('/cuenta/perfil')).toBe('/cuenta/perfil');
  });

  it('returns null for an https URL', () => {
    expect(sanitizeRedirectTo('https://evil.com')).toBeNull();
  });

  it('returns null for an http URL', () => {
    expect(sanitizeRedirectTo('http://evil.com/path')).toBeNull();
  });

  it('returns null for a protocol-relative URL (starts with //)', () => {
    expect(sanitizeRedirectTo('//evil.com')).toBeNull();
  });

  it('returns null for javascript: scheme', () => {
    expect(sanitizeRedirectTo('javascript:alert(1)')).toBeNull();
  });

  it('returns null when path contains :// somewhere inside', () => {
    expect(sanitizeRedirectTo('/path/http://evil.com')).toBeNull();
  });
});
