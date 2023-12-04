"use client";

import { cn } from "@/lib/utils";
import { GameState } from "@/models/game-state";
import { GCard } from "@/models/gcard";
import Image from "next/image";
import { useContext, useEffect, useRef } from "react";
import { FieldLeftTopContext } from "./spider";

interface CardComponentProps {
  card: GCard;
  gameState: GameState;
  borderLight?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({
  card,
  gameState,
  borderLight,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const fieldTopLeft = useContext(FieldLeftTopContext);

  useEffect(() => {
    if (ref.current) {
      const coor = ref.current.getBoundingClientRect();
      // console.log(coor)
      card.setTopLeft(coor.top, coor.left, coor.width, coor.height);
    }
  }, [ref, gameState, fieldTopLeft]);
  return (
    <div
      ref={ref}
      className={cn("absolute border border-solid border-zinc-300 rounded-lg", borderLight)}
      style={{ width: "6vw", height: "8vw" }}
    >
      <Image
        src={`/images/${card.suit.charAt(0)}${card.value}.png`}
        fill
        alt="card"
        draggable={false}
        style={{
          objectFit: 'cover',
        }}
      />
      { !card.isOpen ? 
      <Image
        src={
         
            
            "/images/spider_red.png"
        }
        fill
        alt="card"
        style={{
          objectFit: 'cover',
        }}
        draggable={false}
      />
      : null}
    </div>
  );
};

export default CardComponent;
