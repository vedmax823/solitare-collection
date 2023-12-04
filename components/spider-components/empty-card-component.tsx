"use client";

import { GameState } from "@/models/game-state";
import Image from "next/image";
import { useContext, useEffect, useRef } from "react";

interface EmptyCardProps {
  indexLine: number;
  gameState: GameState;
}

const EmptyCardComponent: React.FC<EmptyCardProps> = ({
  indexLine,
  gameState,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
      if(ref.current){
          const coor = ref.current.getBoundingClientRect()
          gameState.setEmptyCoords(indexLine, coor.top , coor.left , coor.width, coor.height)
      }
  }, [ref, gameState])

  return (
    <div style={{width : "6vw", height:"8vw", }} ref={ref}>
      <Image
        alt="empty"
        src="/images/emptySpace.png"
        fill
        draggable={false}
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

export default EmptyCardComponent;
