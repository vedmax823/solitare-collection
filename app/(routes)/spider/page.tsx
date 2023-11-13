"use client";

import { createContext, useEffect, useRef, useState } from "react";

import SpiderField from "@/components/spider-components/spider-main-fields";
import { GameState, SuiutsEnum } from "@/models/game-state";
import { GCard } from "@/models/gcard";
import Modal from "@/components/ui/modal";


export type FieldLeftTopType = {
  top: number;
  left: number;
};

const fieldLeftTopZero = { top: 0, left: 0 };
export const FieldLeftTopContext =
  createContext<FieldLeftTopType>(fieldLeftTopZero);
export const MouseCoordsContext = createContext<FieldLeftTopType | undefined>(
  undefined
);

const SpiderPage = () => {
  const [countOfSuiuts, setCountsOfSiuts] = useState<SuiutsEnum>(1)
  const refField = useRef<HTMLDivElement>(null);
  const [mouseCoords, setMouseCoords] = useState<FieldLeftTopType>();
  const [fieldLeftTop, setFieldLeftTop] =
    useState<FieldLeftTopType>(fieldLeftTopZero);
  const [selectedCards, setSelectedCards] = useState<GCard[]>();
  const [gameState, setGameState] = useState<GameState>();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isWon, setIsWon] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const handleSetSuitsCount = (count : SuiutsEnum) => {
    setCountsOfSiuts(count)
  }
  useEffect(() => {
    if (refField.current) {
      const coorField = refField.current.getBoundingClientRect();
      setFieldLeftTop({ top: coorField.y, left: coorField.x });
    }
  }, [refField, gameState]);

  const handleOpen = () => {
    setIsOpenDialog(() => true);
  };

  const handleSetIsGameOver = () => {
    setIsGameOver(() => true)
  }

  const handleClose = () => {
    setIsOpenDialog(() => false);
  };

  const mouseMoveHandle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (selectedCards) {
      setMouseCoords(() => {
        return {
          top: e.pageY - fieldLeftTop.top - 25,
          left: e.pageX - fieldLeftTop.left - 30,
        };
      });
    }
  };


  const selectCardHandle = (cards: GCard[] | undefined) => {
    setMouseCoords(() => undefined);
    setSelectedCards(() => cards);
  };

  const handleSetGameState = (newGameState: GameState) => {
    setIsGameOver(() => false)
    setIsWon(() => false)
    setGameState(() => newGameState);
  };


  useEffect(() => {

    if(!gameState){
        const storageData = localStorage.getItem('spider')
        
        if (storageData){
            const gameData : GameState = JSON.parse(storageData)
            const newGameState = new GameState(gameData.howMachSuiuts)
            newGameState.setData(gameData.lines, gameData.additional, gameData.fullCells, gameData.moves)
            handleSetGameState(newGameState)

        }
        else{
            handleOpen()
        }
    }

    else{
      if (gameState.checkIfWon()) {
        setIsWon(() => true)
        handleOpen();
        return;
      }
    }

}, [gameState, isOpenDialog])


  return (
    <MouseCoordsContext.Provider value={mouseCoords}>
      <FieldLeftTopContext.Provider value={fieldLeftTop}>
        <div
          className="w-full"
          ref={refField}
          onMouseMove={(e) => mouseMoveHandle(e)}
        >
          {gameState ? (
            <SpiderField
              gameState={gameState}
              selectedCards={selectedCards}
              selectCardHandle={selectCardHandle}
              handleSetGameState={handleSetGameState}
              handleOpen={handleOpen}
              handleSetIsGameOver={handleSetIsGameOver}
            />
          ) : null}
          <Modal 
            open={isOpenDialog} 
            onClose={handleClose} 
            isGameOver={isGameOver} 
            handleSetSuitsCount={handleSetSuitsCount} 
            countOfSuits={countOfSuiuts}
            handleSetGameState={handleSetGameState}
            isWon={isWon}
          />
        </div>
      </FieldLeftTopContext.Provider>
    </MouseCoordsContext.Provider>
  );
};

export default SpiderPage;
