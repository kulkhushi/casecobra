import { cn } from "@/lib/utils";

type PhotpropsType = React.HTMLAttributes<HTMLDivElement> & {
  imgSrc: string;
  dark?: boolean;
};

export const Phone = ({ imgSrc,className, dark = false, ...props }: PhotpropsType) => {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      <img
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        className="pointer-events-none z-50 select-none"
        alt="phone image"
      />

      <div className="absolute -z-10 inset-0">
        <img
          className="object-cover min-w-full min-h-full"
          src={imgSrc}
          alt="overlaying phone image"
        />
      </div>
    </div>
  );
};
