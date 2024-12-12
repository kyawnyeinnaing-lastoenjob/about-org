// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const routeFilter = (params: any) => {
  return new URLSearchParams(params);
};

// Helper function to convert ReadableStream to a Buffer
export async function streamToBuffer(
  stream: ReadableStream<Uint8Array>,
): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  let result = await reader.read();

  while (!result.done) {
    chunks.push(result.value);
    result = await reader.read();
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

export const decodeSlug = (slug: string | string[] | undefined): string => {
  if (!slug) {
    console.warn("No slug provided for decoding!!!.");
    return "";
  }

  try {
    if (Array.isArray(slug)) {
      return slug.map(decodeURIComponent).join("/");
    }
    return decodeURIComponent(slug);
  } catch (error) {
    console.error("Failed to decode slug:", slug, error);
    return Array.isArray(slug) ? slug.join("/") : slug;
  }
};
