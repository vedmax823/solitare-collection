"use client";
import { FieldLeftTopType } from '@/app/(routes)/spider/page';
import { GameState } from '@/models/game-state';
import { GCard } from '@/models/gcard';
import { useEffect, useRef, useState } from 'react';
import CardComponent from './card-component';


interface MovingCardProps {
    card: GCard,
    coorStart: FieldLeftTopType,
    coorEnd: FieldLeftTopType,
    indexLine: number,
    gameState : GameState
}

const MovingCard = ({ card, coorStart, coorEnd, gameState }: MovingCardProps) => {
    const boxRef = useRef<HTMLDivElement>(null)
    const [coords, setCoords] = useState(coorStart)

    useEffect(() => {
        if (boxRef.current) {
            setCoords(coorEnd)
        }
    }, [boxRef])

    return (
        <div
            ref={boxRef}
            className="ease-out duration-300 absolute"
            style={{
                top : coords.top,
                left : coords.left
            }}
        >
            <CardComponent card={card} gameState={gameState}/>
        </div>

    );
};

export default MovingCard;