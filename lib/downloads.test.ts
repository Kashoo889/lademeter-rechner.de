import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { DOWNLOAD_UPDATED, DOWNLOAD_VERSION, downloadFilePath, downloadPages, formatFileSize } from "./downloads";

const hash = (file: string) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");

describe("downloads", () => {
  const files = downloadPages.flatMap((page) => page.files);

  it("jede Datei existiert in public/downloads und ist identisch mit seo/assets", () => {
    for (const file of files) {
      const publicPath = downloadFilePath(file.filename);
      const sourcePath = path.join(process.cwd(), "seo", "assets", file.filename);
      expect(fs.existsSync(publicPath), `${file.filename} fehlt in public/downloads`).toBe(true);
      expect(fs.statSync(publicPath).size).toBeGreaterThan(10_000);
      if (fs.existsSync(sourcePath)) {
        expect(hash(publicPath), `${file.filename} weicht von seo/assets ab (node seo/tools/sync_downloads.mjs)`).toBe(hash(sourcePath));
      }
    }
  });

  it("Dateiformate stimmen mit der Endung überein (XLSX = ZIP, PDF = %PDF)", () => {
    for (const file of files) {
      const head = fs.readFileSync(downloadFilePath(file.filename)).subarray(0, 4).toString("latin1");
      if (file.format === "xlsx") expect(head.startsWith("PK")).toBe(true);
      if (file.format === "pdf") expect(head).toBe("%PDF");
    }
  });

  it("Landingpage-Pfade sind eindeutig und mit Schrägstrich kanonisch", () => {
    const paths = downloadPages.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) expect(p).toMatch(/^\/[a-z0-9-]+\/$/);
  });

  it("Version, Datum und Dateigröße sind sinnvoll", () => {
    expect(DOWNLOAD_VERSION).toMatch(/^\d+\.\d+$/);
    expect(DOWNLOAD_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const file of files) expect(formatFileSize(file.filename)).toMatch(/^\d[\d.,]* (KB|MB)$/);
  });
});
