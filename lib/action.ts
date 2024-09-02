'use server'
import { redirect } from "next/navigation";
import { AddToorderTypes } from "./types";
import { db } from "@/db";


export const getUploadImageUrlByUser = async ({ id }: { id: string }) => {
  const ImageMetadata = await db.configuration.findUnique({
    where: {
      id: id,
    },
  });

  if (!ImageMetadata) {
    return redirect("/configure/upload");
  }
  return { ImageMetadata };
};


export const addToOrder=async ({color,finishes,metrials,model,configId}:AddToorderTypes)=>{

  console.log("color,finishes,metrials,model",color,finishes,metrials,model);
  await db.configuration.update({
    where: { id: configId },
    data: { color,finishes,metrials,model },
  })

}