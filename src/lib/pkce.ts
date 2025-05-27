import crypto from 'crypto';

// Convert a base64 string to base64url format
function base64ToBase64URL(base64: string): string {
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateCodeVerifier() {
  // Generate random bytes and convert to base64, then make it URL safe
  const base64String = crypto.randomBytes(32).toString('base64');
  return base64ToBase64URL(base64String);
}

export function generateCodeChallenge(verifier: string) {
  // Create SHA256 hash and convert to base64, then make it URL safe
  const base64String = crypto.createHash('sha256')
    .update(verifier)
    .digest('base64');
  return base64ToBase64URL(base64String);
}