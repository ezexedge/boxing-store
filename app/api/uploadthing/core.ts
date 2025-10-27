import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  productImages: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      // You can add authentication here if needed
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[v0] Upload complete for file:", file.url)
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
