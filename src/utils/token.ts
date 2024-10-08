import crypto from 'crypto'

export function hashWithSalt(value: string, salt: string) {
  return crypto.pbkdf2Sync(value, salt, 1000, 64, 'sha512').toString('hex')
}

export function generate64ByteHex() {
  return crypto.randomBytes(64).toString('hex')
}

export function generate32ByteHex() {
  return crypto.randomBytes(16).toString('hex')
}

export function generate16ByteHex() {
  return crypto.randomBytes(16).toString('hex')
}
