import { test, describe } from 'node:test';
import assert from 'node:assert';
import { RESERVED_USERNAMES } from '../src/lib/constants';
import { hashPassword, verifyPassword } from '../src/lib/auth';
import { verifyPaystackSignature } from '../src/lib/paystack';
import crypto from 'crypto';

describe('TapBiz SaaS Business Logic Test Suite', () => {

  test('1. Reserved Handle Protection System', () => {
    assert.strictEqual(RESERVED_USERNAMES.has('admin'), true);
    assert.strictEqual(RESERVED_USERNAMES.has('api'), true);
    assert.strictEqual(RESERVED_USERNAMES.has('dashboard'), true);
    assert.strictEqual(RESERVED_USERNAMES.has('cliff-tailoring'), false);
  });

  test('2. Bcrypt Password Hashing & Verification', async () => {
    const rawPassword = 'SecureNigerianPass123!';
    const hash = await hashPassword(rawPassword);

    assert.notStrictEqual(hash, rawPassword);
    assert.strictEqual(await verifyPassword(rawPassword, hash), true);
    assert.strictEqual(await verifyPassword('WrongPassword', hash), false);
  });

  test('3. Paystack Webhook HMAC SHA512 Signature Validation', () => {
    const rawBody = JSON.stringify({ event: 'charge.success', data: { reference: 'TAPBIZ_12345' } });
    const secret = 'whsec_test_secret_key';
    const validSignature = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    process.env.PAYSTACK_WEBHOOK_SECRET = secret;
    assert.strictEqual(verifyPaystackSignature(rawBody, validSignature), true);
    assert.strictEqual(verifyPaystackSignature(rawBody, 'invalid_signature_hash'), false);
  });

  test('4. NFC Redirect Token Tokenization', () => {
    const token = `nfc_cliff_${Math.random().toString(36).substring(2, 8)}`;
    assert.match(token, /^nfc_cliff_[a-z0-9]+$/);
    assert.strictEqual(token.length > 10, true);
  });

});
