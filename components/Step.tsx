"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const STEPS = [
  {
    name: "Step 1: Add image",
    description: "Choose an image for your case",
    url: "/upload",
  },
  {
    name: "Step 2: Customize design",
    description: "Make the case yours",
    url: "/design",
  },
  {
    name: "Step 3: Summary",
    description: "Review your final design",
    url: "/preview",
  },
];

export const Step = () => {
  const pathname = usePathname();

  return (
    <div>
      <ul className="grid lg:border-b-2 lg:border-gray-200 sm:grid-cols-3 items-center lg:grid-cols-3 bg-white">
        {STEPS.map((step, i) => {
          const currentStep = pathname.endsWith(step.url);
          const isCompleted = STEPS.slice(i + 1).some((t) => {
            return pathname.endsWith(t.url);
        });
          console.log(isCompleted);
          return (
            <li className="relative" key={step.name}>
              <span
                className={`absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full  ${currentStep ? "bg-zinc-700" : ""} ${isCompleted ? "!bg-green-500" : ""}`}
                aria-hidden="true"
              ></span>
              <div className="lg:pl-9 flex gap-2 items-center px-6 py-4 text-sm font-medium">
                <div>
                  <img
                    src={`/snake-${i + 1}.png`}
                    className="flex h-20 w-20 items-center justify-center object-contain border-zinc-700"
                  />
                </div>
                <div>
                  <h3
                    className={cn(
                      "font-medium text-[14px] mb-1",
                      isCompleted && "text-green-600"
                    )}
                  >
                    {step.name}
                  </h3>
                  <p className="text-gray-500">{step.description}</p>
                </div>
              </div>
              {i !== 0 ? (
                <div className="absolute inset-0 hidden w-3 lg:block">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 12 82"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0.5 0V31L10.5 41L0.5 51V82"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
