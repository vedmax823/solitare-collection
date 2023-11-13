"use client";

import { MouseCoordsContext } from '@/app/(routes)/spider/page';
import { GameState } from '@/models/game-state';
import { GCard } from '@/models/gcard';
import React, { useContext} from 'react';
import CardComponent from './card-component';





interface SelectedCardsProps {
    cards: GCard[],
    mouseUpHandle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    gameState : GameState

}

const SelectedCardsComponent = ({ cards, mouseUpHandle, gameState }: SelectedCardsProps) => {
    const mouseCoords = useContext(MouseCoordsContext)

    return (
        <div
            style={{
                top : mouseCoords ? mouseCoords.top : cards[0].top,
                left : mouseCoords ? mouseCoords.left : cards[0].left
            }}

            className='absolute'
            // sx={{
            //     minWidth: '6vw',
            //     minHeight: '8vw',
            //     background: 'white',
            //     borderRadius: 3,
            //     position: "absolute",
            //     top: mouseCoords ? mouseCoords.top : cards[0].top,
            //     left: mouseCoords ? mouseCoords.left : cards[0].left
            // }}
            onMouseUp={(e) => mouseUpHandle(e)}
        >
            {
                cards.map((card, index) => {
                    const top = index * Math.round(card.height / 5)
                    return <div
                        key={index}
                        className='absolute'
                        style={{
                            top
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
                        <CardComponent card={card} gameState={gameState}/>
                    </div>
                }
                )
            }
        </div>

    );
};

export default SelectedCardsComponent;