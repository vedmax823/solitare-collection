"use client";

import { useContext, useEffect, useRef } from "react";

import { GameState } from "@/models/game-state";
import CardComponent from "./card-component";
import Image from "next/image";

interface SolvedCardProps {
  indexLine: number;
  gameState: GameState;
}

const SolvedCardsComponent: React.FC<SolvedCardProps> = ({
  indexLine,
  gameState,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
      if (ref.current) {
          const coor = ref.current.getBoundingClientRect()
          gameState.setSolvedCoords(indexLine, coor.top, coor.left, coor.width, coor.height)
      }
  }, [ref, gameState])
  return (
    <div
      ref={ref}
      className="relative"
      style={{width : "6vw", height:"8vw", }}
    >
      {gameState.fullCells[7 - indexLine] &&
      gameState.fullCells[7 - indexLine].length !== 0 ? (
        <div
          className="absolute"
        >
          <CardComponent card={gameState.fullCells[7 - indexLine][0]} gameState={gameState}/>
        </div>
      ) : (
          <Image
            src="/images/emptySpace.png"
            alt="empty"
            fill
            draggable={false}
            style={{
              objectFit: 'cover',
            }}
          />
      )}
    </div>
  );
};

export default SolvedCardsComponent;
