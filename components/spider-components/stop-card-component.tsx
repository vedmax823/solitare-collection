import { FieldLeftTopContext, FieldLeftTopType } from "@/app/(routes)/spider/page";
import Image from "next/image";
import { FC, useContext, useEffect, useRef } from "react";

interface StopCardProps {
  handleSetTopLeftAdditional : (coords : FieldLeftTopType) => void
}

const StopCardComponent : FC<StopCardProps> = ({ handleSetTopLeftAdditional  }) => {
  const lineRef = useRef<HTMLDivElement>(null)
  const fieldTopLeft = useContext(FieldLeftTopContext)

  useEffect(() => {
      if (lineRef.current){
          const coor = lineRef.current.getBoundingClientRect()
          handleSetTopLeftAdditional({top : coor.top, left : coor.left})
      }
  }, [lineRef, fieldTopLeft])
  return (
    <div 
      ref={lineRef}
      className="absolute"
      style={{width : "6vw", height:"8vw"}}
    >
      <Image   
        src="/images/stop.png"
        alt="stop"
        fill
        draggable={false}
      />
    </div>
  );
};

export default StopCardComponent;
