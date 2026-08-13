import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "kushis_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type StoredUser = {
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type SessionPayload = SessionUser & {
  exp: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be configured with at least 32 characters before authentication can be used.",
    );
  }

  return secret;
}

function deriveKey(purpose: string) {
  return createHmac("sha256", getAuthSecret()).update(purpose).digest();
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function userDocumentId(email: string) {
  const digest = createHmac("sha256", deriveKey("customer-document-id"))
    .update(normalizeEmail(email))
    .digest("hex");

  return `customerAuth.${digest}`;
}

function scryptPassword(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey as Buffer);
    });
  });
}

export async function hashPassword(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const derivedKey = await scryptPassword(password, passwordSalt);

  return {
    passwordSalt,
    passwordHash: derivedKey.toString("hex"),
  };
}

export async function verifyPassword(
  password: string,
  passwordSalt: string,
  passwordHash: string,
) {
  const expected = Buffer.from(passwordHash, "hex");
  const actual = await scryptPassword(password, passwordSalt);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function encryptStoredUser(user: StoredUser) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", deriveKey("customer-record"), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(user), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptStoredUser(payload: string): StoredUser | null {
  try {
    const [version, ivValue, authTagValue, encryptedValue] = payload.split(".");

    if (version !== "v1" || !ivValue || !authTagValue || !encryptedValue) {
      return null;
    }

    const decipher = createDecipheriv(
      "aes-256-gcm",
      deriveKey("customer-record"),
      Buffer.from(ivValue, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(authTagValue, "base64url"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");

    const user = JSON.parse(decrypted) as Partial<StoredUser>;

    if (
      typeof user.name !== "string" ||
      typeof user.email !== "string" ||
      typeof user.passwordHash !== "string" ||
      typeof user.passwordSalt !== "string"
    ) {
      return null;
    }

    return user as StoredUser;
  } catch {
    return null;
  }
}

export function createSessionToken(user: SessionUser) {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = createHmac("sha256", deriveKey("session-signing"))
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = createHmac(
      "sha256",
      deriveKey("session-signing"),
    )
      .update(encodedPayload)
      .digest();
    const actualSignature = Buffer.from(signature, "base64url");

    if (
      expectedSignature.length !== actualSignature.length ||
      !timingSafeEqual(expectedSignature, actualSignature)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<SessionPayload>;

    if (
      typeof payload.id !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return token ? verifySessionToken(token) : null;
}
