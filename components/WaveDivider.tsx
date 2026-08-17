import { cn } from "@/lib/utils";

export default function WaveDivider({
  className,
  flip,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block h-10 w-full sm:h-14", flip && "-scale-y-100", className)}
    >
      <path
        d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,32 L1440,60 L0,60 Z"
        fill="currentColor"
      />
    </svg>
  );
}
