import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

export class Password {
  private static readonly saltGen = 16;

  private static getHash(value: string, salt: string) {
    return pbkdf2Sync(value, salt, 100_000, 64, 'sha512').toString('hex');
  }

  static hash(value: string) {
    const salt = randomBytes(this.saltGen).toString('hex');
    const hash = this.getHash(value, salt);
    return `${salt}:${hash}`;
  }

  static compare(value: string, hashedValue: string) {
    const [salt, originalHash] = hashedValue.split(':');
    const hash = this.getHash(value, salt);

    const originalBuffer = Buffer.from(originalHash, 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');

    return originalBuffer.length === hashBuffer.length && timingSafeEqual(originalBuffer, hashBuffer);
  }
}
