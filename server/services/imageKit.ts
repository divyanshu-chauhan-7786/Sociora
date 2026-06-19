interface ImageKitUploadInput {
  buffer: Buffer;
  fileName: string;
  folder: string;
  mimeType: string;
}

const getImageKitConfig = () => {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT ?? process.env.IMAGEKIT_URL_ENDPOIN;

  return { privateKey, publicKey, urlEndpoint };
};

export const assertImageKitConfigured = () => {
  const { privateKey, publicKey, urlEndpoint } = getImageKitConfig();

  if (!privateKey || !publicKey || !urlEndpoint) {
    throw new Error("ImageKit is not configured. Add IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, and IMAGEKIT_URL_ENDPOINT to server/.env.");
  }
};

export const uploadToImageKit = async ({
  buffer,
  fileName,
  folder,
  mimeType,
}: ImageKitUploadInput) => {
  const { privateKey } = getImageKitConfig();

  assertImageKitConfigured();

  const form = new FormData();
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  form.set("file", new Blob([arrayBuffer], { type: mimeType }), fileName);
  form.set("fileName", fileName);
  form.set("folder", folder);
  form.set("useUniqueFileName", "true");

  const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`,
    },
    body: form,
  });

  const data = await uploadResponse.json().catch(() => ({}));

  if (!uploadResponse.ok || !data.url) {
    throw new Error(data.message ?? "ImageKit upload failed");
  }

  return {
    url: String(data.url),
    fileId: data.fileId ? String(data.fileId) : undefined,
    name: data.name ? String(data.name) : fileName,
  };
};
