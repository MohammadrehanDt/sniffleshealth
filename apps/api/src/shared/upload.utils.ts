import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { randomUUID } from "node:crypto";

export const UPLOAD_DIR = join(process.cwd(), "uploads");
export const CERTIFICATE_UPLOAD_DIR = join(UPLOAD_DIR, "certificates");

export function ensureUploadDirectories() {
  if (!existsSync(CERTIFICATE_UPLOAD_DIR)) {
    mkdirSync(CERTIFICATE_UPLOAD_DIR, { recursive: true });
  }
}

ensureUploadDirectories();

export const certificateStorage = diskStorage({
  destination: CERTIFICATE_UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const MAX_CERTIFICATE_SIZE = 10 * 1024 * 1024; // 10 MB
