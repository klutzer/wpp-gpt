import fs, { ReadStream } from "node:fs";
import os from "node:os";
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "node:stream";

export const convertOggToM4a = async (audio: Buffer, prefix: string): Promise<ReadStream> => {
  let tmpDir;
  try {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), `wpp-gpt-${prefix}`));
    const m4aFile = path.join(tmpDir, "audio.m4a");
    await new Promise((resolve, reject) => {
      ffmpeg(Readable.from(audio))
        .output(m4aFile)
        .withOption("-y")
        .on("end", resolve)
        .on("error", reject)
        .run();
    });
    return fs.createReadStream(m4aFile);
  } finally {
    if (tmpDir) {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  }
}