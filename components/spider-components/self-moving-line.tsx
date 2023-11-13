"use client";

import { useEffect, useRef, useState } from "react";
import { GCard } from "@/models/gcard";
import { GameState } from "@/models/game-state";
import CardComponent from "./card-component";

interface SelfMovingLineComponentProps {
  cardLine: GCard[];
  topEnd: number;
  leftEnd: number;
  gameState: GameState;
}

const SelfMovingLineComponent = ({
  cardLine,
  topEnd,
  leftEnd,
  gameState,
}: SelfMovingLineComponentProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({
    top: cardLine[0].top,
    left: cardLine[0].left,
  });

  useEffect(() => {
    if (boxRef.current) {
      setCoords({ top: topEnd, left: leftEnd });
    }
  }, [boxRef]);
  return (
    <div
      className="ease-out duration-300 absolute"
      style={{
        top: coords.top,
        left: coords.left,
      }}
    >
      {cardLine.map((card, index) => {
        const top = index * Math.round(card.height / 5);
        return (
          <div
            key={index}
            ref={boxRef}
            className="ease-out duration-300 absolute"
            style={{ top }}
          >
            <CardComponent card={card} gameState={gameState} />
          </div>
        );
      })}
    </div>
  );
};

export default SelfMovingLineComponent;
