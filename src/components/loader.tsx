import { Loader2 } from "lucide-react";

export const Loader = ({width, height, color} : {width: number, height: number, color: string}) => {
  return (
    <div className="loader-container">
      <Loader2 className={`loader-icon w-[${width}px] h-[${height}px] text-[${color}]`} />
    </div>
  );
};
