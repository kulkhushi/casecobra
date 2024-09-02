import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .input(
      z.object({
        configId: z.string().optional(),
      })
    )
    .middleware(async ({ req, input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      //console.log("Upload complete for userId:", metadata.userId);

      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();

      const imageMetadata = await sharp(buffer).metadata();

      const { width, height } = imageMetadata;
      const { configId } = metadata.input;
      if (!configId) {
        const configureation = await db.configuration.create({
          data: {
            width: width || 500,
            height: height || 500,
            imageUrl: file.url,
          },
        });
        return { configId: configureation.id };
      } else {
        const updateconfigureation = await db.configuration.update({
          where: { id: configId },
          data: {
            croopedImgUrl: file.url,
          },
        });
        return { configId: updateconfigureation.id };
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      //return { configId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
