import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/client";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

// Convert the ReadableStream to Buffer
async function streamToBuffer(
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { status: 400, message: "No file provided" },
        { status: 400 },
      );
    }

    // Check file size (2 MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { status: 400, message: "File size exceeds the 2 MB limit" },
        { status: 400 },
      );
    }

    const contentType = file.type;
    const buffer = await streamToBuffer(
      file.stream() as ReadableStream<Uint8Array>,
    );
    const extension = contentType.split("/")[1];
    const filename = `uploads/${Date.now()}.${extension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: filename,
        Body: buffer,
        ACL: "public-read",
        ContentType: contentType,
      }),
    );

    const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${filename}`;

    const data = await prisma.file.create({
      data: {
        url: fileUrl,
      },
    });
    return NextResponse.json({
      data: {
        status: 200,
        message: "File uploaded successfully!",
        url: fileUrl,
        data,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
