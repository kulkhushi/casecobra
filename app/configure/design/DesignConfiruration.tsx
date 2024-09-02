"use client";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Rnd } from "react-rnd";
import RoundHandler from "@/components/RoundHandler";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, Fragment, useRef } from "react";
import { COLORS, MODELS, FINISHES, MATERIALS, BASE_PRICE } from "@/components/Validator";
import { Radio, RadioGroup } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Ellipsis } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, CheckCircleIcon, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { getFormatPrice } from "@/utils/helper";
import { useUploadThing } from "@/lib/uploadthing";
import { useMutation } from "@tanstack/react-query";
import { addToOrder } from "@/lib/action";
import { AddToorderTypes } from "@/lib/types";
import { useRouter } from "next/navigation";

type DesignPropstype = {
  width: number;
  height: number;
  id: string;
  imageUrl: string;
};

const DesignConfiruration = ({
  height,
  id,
  imageUrl,
  width,
}: DesignPropstype) => {
  const [activeColor, setColor] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    matrials: (typeof MATERIALS.options)[number];
    finishes: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    matrials: MATERIALS.options[0],
    finishes: FINISHES.options[0]
  });

  const {replace} = useRouter();

const [randerSize, setRanderSize] = useState({
  width: width/4,
  height:height/4
})

const [randarPosition, setrandarPosition] = useState({
  x: 150,
  y: 205
})

const {startUpload,isUploading} =useUploadThing('imageUploader')

const phonCase = useRef<HTMLDivElement>(null);
const containerCase = useRef<HTMLDivElement>(null);

const {isPending,mutate:saveConfig}= useMutation({
  mutationKey:['addCase'],
  mutationFn: async (args:AddToorderTypes) => {
    await  Promise.all([SubmitToContinue(), addToOrder(args)])
    return true;
  },
  onSuccess:()=>{
    replace(`/configure/preview?id=${id}`)
  },
  onError:(error)=>console.error(error)

});

const SubmitToContinue =async ()=>{

  try {
    const {left:caseX, top:caseY, width,height}  =phonCase.current!.getBoundingClientRect();
    const {left:conatinerLeft, top:containerTop}  =containerCase.current!.getBoundingClientRect();

    const leftOffset = caseX - conatinerLeft
    const topOffset = caseY - containerTop

    const actualX = randarPosition.x - leftOffset
    const actualY = randarPosition.y - topOffset

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx= canvas.getContext('2d');


    const userImage = new (window as any).Image();

    userImage.crossOrigin = 'anonymous'
    userImage.src = imageUrl
   
    await new Promise((resolve) => (userImage.onload = resolve))

   
    ctx?.drawImage(
      userImage,
      actualX,
      actualY,
      randerSize.width,
      randerSize.height
    )

     const base64 = canvas.toDataURL()
    const base64Data = base64.split(',')[1]
    const blob = base64ToBlob(base64Data, 'image/png')

    const file = new File([blob], 'filename.png', { type: 'image/png' })
   
    await startUpload([file],{configId:id});
    
  } catch (error) {
    const errorMerrage = error instanceof Error ? error.message:'Somthing is Wrong'
    return errorMerrage
  }
 
}

function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}


  console.log("activeColor",  "color:", activeColor.color.value,
    activeColor.finishes.value,
    activeColor.matrials.value,
    activeColor.model.value,
    );
  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div ref={containerCase} className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
          ref={phonCase}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full pr-4"
          >
            <Image
              src="/phone-template.png"
              alt="Photo by Drew Beamer"
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${activeColor.color.tw}`
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 200,
            width: width / 4,
            height: height / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRanderSize({
              width: parseInt(ref.style.width.slice(0,-2)),
              height: parseInt(ref.style.height.slice(0,-2))
            }),
            setrandarPosition({x, y})

          }}
          onDragStop={(_, { x, y }) => {setrandarPosition({ x, y })}}
          lockAspectRatio
          resizeHandleComponent={{
            topRight: <RoundHandler />,
            bottomRight: <RoundHandler />,
            bottomLeft: <RoundHandler />,
            topLeft: <RoundHandler />,
          }}
          className="absolute z-20 border-[3px] border-primary"
        >
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt="Photo by Drew Beamer"
              fill
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>
      <div className="relative h-[37.5rem] overflow-hidden col-span-1 p-6 bg-white">
        <h1 className="text-2xl font-bold text-center">Customize your case</h1>
        <div className="w-full h-px bg-zinc-200 my-6" />
        <ScrollArea className="h-[27.5rem] w-full ">
          <div className="my-0 h-px w-full pl-3">
            <RadioGroup
              value={activeColor.color}
              onChange={(val) => {
                setColor((prev) => ({
                  ...prev,
                  color: val,
                }));
              }}
              aria-label="Server size"
              className="space-y-2"
            >
              <Label className="capitalize my-3 ">
                Color: {activeColor.color.label}
              </Label>
              <div className="mt-3 flex items-center space-x-3">
                {COLORS.map((color) => (
                  <RadioGroup.Option
                    key={color.label}
                    value={color}
                    className={({ checked }) =>
                      cn(
                        "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                        {
                          [`border-${color.tw}`]: checked,
                        }
                      )
                    }
                  >
                    <span
                      className={cn(
                        `bg-${color.tw}`,
                        "h-8 w-8 rounded-full border border-black border-opacity-10"
                      )}
                    />
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            <div className="w-full items-start mt-6">
              <Label className="capitalize mb-4 ">Models: </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-full hover:no-underline border-2 text-zinc-600 border-zinc-400 text-left focus:hidden justify-start mt-2"
                    variant="link"
                  >
                    {activeColor.model.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {MODELS.options.map((option, index) => {
                    return (
                      <DropdownMenuItem
                        onClick={() =>
                          setColor((val) => {
                            return { ...val, model: option };
                          })
                        }
                        key={option.value}
                      >
                        <Check
                          className={`w-4 mr-1 ${
                            option.value === activeColor.model.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {option.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-full items-start mt-6">
              <Label className="capitalize mb-4 ">Material: </Label>
              <RadioGroup
                value={activeColor.matrials}
                onChange={(val) => {
                  setColor((prev) => {
                    return { ...prev, matrials: val };
                  });
                }}
                aria-label="Server size"
                className="space-y-2"
              >
                {MATERIALS.options.map((plan) => (
                  <Radio
                    key={plan.label}
                    value={plan}
                    className="group relative flex cursor-pointer rounded-lg py-4 px-5 shadow-md transition border-2 focus:border-green-600 focus:outline-2 data-[focus]:outline-1 data-[focus]:outline-green-600 data-[checked]:bg-green-600/10"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="text-sm/6">
                        <p className="font-semibold text-zinc-600">
                          {plan.label}
                        </p>
                        <div className="flex gap-2 text-zinc-400">
                          <div>{plan?.description}</div>
                          <div aria-hidden="true">&middot;</div>
                          <div>{getFormatPrice(plan.price / 100)}</div>
                          <div aria-hidden="true">&middot;</div>
                        </div>
                      </div>
                      <CheckCircleIcon className="size-6 fill-green-700 opacity-0 transition group-data-[checked]:opacity-100" />
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </div>
            <div className="w-full items-start mt-6">
              <Label className="capitalize mb-4">finishes: </Label>
              <RadioGroup
                value={activeColor.finishes}
                onChange={(val) => {
                  setColor((prev) => {
                    return { ...prev, finishes: val };
                  });
                }}
                aria-label="Server size"
                className="space-y-2"
              >
                {FINISHES.options.map((plan) => (
                  <Radio
                    key={plan.label}
                    value={plan}
                    className="group relative flex cursor-pointer rounded-lg py-4 px-5 shadow-md transition border-2 focus:border-green-600 focus:outline-2 data-[focus]:outline-1 data-[focus]:outline-green-600 data-[checked]:bg-green-600/10"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="text-sm/6">
                        <p className="font-semibold text-zinc-600">
                          {plan.label}
                        </p>
                        <div className="flex gap-2 text-zinc-400">
                          <div>{plan?.description}</div>
                          <div aria-hidden="true">&middot;</div>
                          <div>{getFormatPrice(plan.price / 100)}</div>
                          <div aria-hidden="true">&middot;</div>
                        </div>
                      </div>
                      <CheckCircleIcon className="size-6 fill-green-700 opacity-0 transition group-data-[checked]:opacity-100" />
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </div>
        </ScrollArea>
        <h1 className="text-2xl font-bold text-center items-center mt-2">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-sm leading-10">
              {getFormatPrice(BASE_PRICE/100 + activeColor.finishes.price / 100 + + activeColor.matrials.price / 100)}
            </div>
            <div className="col-span-3">
              <Button className="w-full h-7" type="button" disabled={isUploading} onClick={()=>saveConfig(
                {
                  color: activeColor.color.value,
                  finishes:activeColor.finishes.value,
                  metrials: activeColor.matrials.value,
                  model:activeColor.model.value,
                  configId: id
                }
              )}>Continue {' '} {(isUploading || isPending) && (<Ellipsis className="animate-pulse" />)}</Button>
            </div>
          </div>
        </h1>
      </div>
    </div>
  );
};

export default DesignConfiruration;
