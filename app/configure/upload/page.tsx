"use client";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import Dropzone, { FileError, FileRejection } from "react-dropzone";
import {
  SquareDashedMousePointer,
  Image as ImageIcon,
  LoaderCircle,
} from "lucide-react";

import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";


const page = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [progessBar, setProgessBar] = useState<number>(0);
   const {replace} = useRouter();
   const { toast } = useToast()

  const { startUpload, isUploading,routeConfig } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: ([data]) => {
        const configId=data.serverData.configId;
        startTraition(()=>{
          replace(`/configure/design?id=${configId}`)
        })
      },
      onUploadProgress: (r) => {
        setProgessBar(r);
      },
      onUploadBegin: (fileName: string) => {
        console.log('onUploadBegin....')
      },     
      onUploadError: () => {
        alert("error occurred while uploading");
      },    
    },
  );

  const onDropAccepted = (file:File[]) => {
    startUpload(file,{configId: undefined});
    setIsDragOver(false);
  };

  const onDropRejected = (rejectedFile:FileRejection[]) => {
    const [file] = rejectedFile;

    toast({
      title: `${file.file.type} type is not supported`,
      description: "Please choose a PNG, JPG, JPEG ",
      variant:'destructive'
    })
    setIsDragOver(false);

  };

  const [isPending, startTraition] = useTransition();

  return (
    <div
      className={`relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center ${
        isDragOver && "ring-blue-900/25 bg-blue-900/10"
      }`}
    >
      <Dropzone
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        accept={{
          "accept/png": [".png"],
          "accept/jpeg": [".jpeg"],
          "accept/jpg": [".jpg"],
        }}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(true)}
      >
        {({ getRootProps, getInputProps }) => {
          return (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <SquareDashedMousePointer />
              ) : isPending || isUploading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ImageIcon className="text-gray-500" />
              )}
              {isUploading ? (
                <>Uploading....<Progress value={progessBar} className="w-[40%] h-2 my-4" /></>
              ) : isPending ? (
                <p>Redirecting, please wait...</p>
              ) : isDragOver ? (
                <p>
                  <span className="font-semibold">Drop file</span> to upload
                </p>
              ) : (
                <p>
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              )}
              {!isPending &&  <p className="text-sm text-gray-400">
                PNG, JPG, JPEG
              </p>}
             
            </div>
          );
        }}
      </Dropzone>
    </div>
  );
};

export default page;
