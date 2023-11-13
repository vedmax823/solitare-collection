"use client";

import { cn } from "@/lib/utils";
import { GameState } from "@/models/game-state";
import { GCard } from "@/models/gcard";
import Image from "next/image";
import { useContext, useEffect, useRef } from "react";
import { FieldLeftTopContext } from "./spider";

interface CardComponentProps {
  card: GCard;
  gameState : GameState,
  borderLight? : string;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, gameState, borderLight }) => {
  const ref = useRef<HTMLDivElement>(null);
  const fieldTopLeft = useContext(FieldLeftTopContext)

  useEffect(() => {
    if (ref.current) {
        const coor = ref.current.getBoundingClientRect()
        card.setTopLeft(coor.top, coor.left, coor.width, coor.height)
    }
}, [ref, gameState, fieldTopLeft])
  return (
    <div 
        ref={ref}
        className={cn("absolute", borderLight)}
        style={{width : "6vw", height:"8vw"}}
    >
      <Image
        src={
          card.isOpen
            ? `/images/${card.suit.charAt(0)}${card.value}.png`
            : "/images/spider_red.png"
        }
        fill
        
        alt="card"
        draggable={false}
      />
    </div>
  );
};

export default CardComponent;
