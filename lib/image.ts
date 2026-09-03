// Client-side image compression so admin uploads stay small/fast (avoids proxy
// timeouts and body-size limits when uploading multiple full-resolution photos).
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    // Keep the original if compression didn't actually shrink it.
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

export function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressImage));
}

export function toFileList(files: File[]): FileList {
  const dt = new DataTransfer();
  files.forEach((file) => dt.items.add(file));
  return dt.files;
}
