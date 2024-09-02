import React from "react";
import { redirect } from "next/navigation";
import { getUploadImageUrlByUser } from "@/lib/action";
import DesignPreview from "./DesignPreview";

const Preview = async ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    redirect(`/upload`);
    return;
  }

  const { ImageMetadata } = await getUploadImageUrlByUser({ id }); // Fixed: Added imageUrl property to destructure
  if (!ImageMetadata) {
    redirect(`/upload`);
    return;
  }

  return <DesignPreview configureation={ImageMetadata!} />;
};

export default Preview;
