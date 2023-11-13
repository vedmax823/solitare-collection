"use client";
import { GCard } from "@/models/gcard";
import { useContext, useEffect, useRef, useState } from "react";
import CardComponent from "./card-component";
import { FieldLeftTopContext, FieldLeftTopType } from "@/app/(routes)/spider/page";
import { GameState } from "@/models/game-state";
import { cn } from "@/lib/utils";

interface AdditionalLineProps {
  index: number;
  line: GCard[];
  gameState : GameState;
  clickOnAdditional : (index : number, coords : FieldLeftTopType) => void;
  lightAdditional : boolean;
}

const AdditionalLine: React.FC<AdditionalLineProps> = ({ index, line, gameState, clickOnAdditional, lightAdditional }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const lineRef = useRef<HTMLDivElement>(null);
  const fieldTopLeft = useContext(FieldLeftTopContext);

  console.log(lightAdditional)

  const borderLight = lightAdditional && index == gameState.additional.length - 1 ? 'border-4 border-solid border-sky-500 rounded-xl' : ''

  useEffect(() => {
    if (lineRef.current) {
      const coor = lineRef.current.getBoundingClientRect();
      setCoords({top : coor.top - fieldTopLeft.top, left : coor.left - fieldTopLeft.left})
      gameState.setAdditionalLineCoords({top : coor.top, left : coor.left})

    }
  }, [lineRef, fieldTopLeft]);

  const left = index * 20;

  return (
    <div
      ref={lineRef}
      className={cn("absolute")}
      onClick={() => clickOnAdditional(index, coords)}
      // style={{ left }}
      style={{width : "6.6vw", height:"8.6vw", left}}
    >
      {line.map((card, index) => (
        
          <CardComponent key={index} card={card} gameState={gameState} borderLight={borderLight}/>
        
      ))}
    </div>
  );
};

export default AdditionalLine;
