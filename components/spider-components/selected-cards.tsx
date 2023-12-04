"use client";

import { GameState } from "@/models/game-state";
import { GCard } from "@/models/gcard";
import React, { useContext } from "react";
import CardComponent from "./card-component";
import { FieldLeftTopType, MouseCoordsContext } from "./spider";
import Image from "next/image";

interface SelectedCardsProps {
  cards: GCard[];
  mouseUpHandle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  gameState: GameState;
  mouseCoords: FieldLeftTopType;
}

const SelectedCardsComponent = ({
  cards,
  mouseUpHandle,
  gameState,
  mouseCoords,
}: SelectedCardsProps) => {
  console.log(mouseCoords);
  return (
    <div
      style={{
        top: mouseCoords ? mouseCoords.top : cards[0].top,
        left: mouseCoords ? mouseCoords.left : cards[0].left,
      }}
      className="absolute"
      onMouseUp={(e) => mouseUpHandle(e)}
    >
      {cards.map((card, index) => {
        const top = index * Math.round(card.height / 5);
        return (
          <div
            key={index}
            className="absolute"
            style={{
              top,
            }}
            // sx={{
            //     minWidth: '6vw',
            //     height: '8vw',
            //     color: "black",
            //     background: 'white',
            //     borderRadius: 3,
            //     position: "absolute",
            //     top:{ top }
            // }}
          >
            <div className="absolute" style={{ width: "6vw", height: "8vw" }}>
              <Image
                src={
                    `/images/${card.suit.charAt(0)}${card.value}.png`
                }
                fill
                alt="card"
                draggable={false}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectedCardsComponent;
