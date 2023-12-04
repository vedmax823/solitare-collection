
"use client";
import Image from "next/image";
import { FC, useContext, useEffect, useRef } from "react";
import { FieldLeftTopContext, FieldLeftTopType } from "./spider";
import { GameState } from "@/models/game-state";

interface StopCardProps {
  handleSetTopLeftAdditional : (coords : FieldLeftTopType) => void,
  gameState : GameState
}

const StopCardComponent : FC<StopCardProps> = ({ handleSetTopLeftAdditional, gameState  }) => {
  const lineRef = useRef<HTMLDivElement>(null)
  

  useEffect(() => {
      if (lineRef.current){
          const coor = lineRef.current.getBoundingClientRect()
          handleSetTopLeftAdditional({top : coor.top, left : coor.left})
      }
  }, [lineRef, gameState])
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
