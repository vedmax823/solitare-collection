"use client";
import { useContext, useEffect, useState } from "react";

import { GameState, HintMove, Move } from "@/models/game-state";
import StopCardComponent from "./stop-card-component";
import AdditionalLine from "./additional-line";
import SolvedCardsComponent from "./solved-cards-component";
import CardComponent from "./card-component";
import EmptyCardComponent from "./empty-card-component";
import { GCard } from "@/models/gcard";

import SelfMovingLineComponent from "./self-moving-line";
import SelectedCardsComponent from "./selected-cards";
import MovingCard from "./moving-card";
import Button from "../ui/button";
import { Gamepad2, Lightbulb, Undo2 } from "lucide-react";
import ModalEmptyRow from "../ui/modalEmptyRow";
import { FieldLeftTopType } from "./spider";

interface CardsFieldsProps {
  gameState: GameState;
  selectedCards: GCard[] | undefined;
  selectCardHandle: (cards: GCard[] | undefined) => void;
  handleSetGameState: (newGameState: GameState) => void;
  handleOpen: () => void;
  handleSetIsGameOver: () => void;
  mouseCoords : FieldLeftTopType | undefined;
}

type HintAndCount = {
  hints: HintMove[];
  count: number;
};

type CardsCoordsType = {
  cards: GCard[];
  coords: FieldLeftTopType;
};

const SpiderField: React.FC<CardsFieldsProps> = ({
  gameState,
  selectedCards,
  selectCardHandle,
  handleSetGameState,
  handleOpen,
  handleSetIsGameOver,
  mouseCoords
}) => {
  const [selectedLine, setSelectedLine] = useState<number>();
  const [topLeftAdditional, setTopLeftAdditional] = useState<FieldLeftTopType>({
    top: 0,
    left: 0,
  });
  const [lightAdditional, setLightAdditional] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [emptyFieldModal, setEmptyFieldOpen] = useState(false);
  const [selfMoving, setSelfMoving] = useState<{
    cards: GCard[];
    topEnd: number;
    leftEnd: number;
    lineStart: number;
    lineEnd: number;
    isBack: boolean;
  }>();
  const [solvedCards, setSolvedCards] = useState<GCard[]>();
  const [hints, setHints] = useState<HintAndCount>();
  const [movigHint, setMovingHint] = useState<{
    cards: GCard[];
    top: number;
    left: number;
    startIndex: number;
  }>();
  const [additionalOpenedBack, setAdditionalOpenedBack] =
    useState<CardsCoordsType>();
  const [additionalOpened, setAdditionalOpened] = useState<CardsCoordsType>();

  let mouseHoldTimeout: ReturnType<typeof setTimeout>;

  const handleLightAdditional = () => {
    setLightAdditional(() => true);
  };
  const handleUnLightAdditional = () => {
    setLightAdditional(() => false);
  };

  const onOpenEmptyField = () => {
    setEmptyFieldOpen(() => true);
  };

  const onCloseEmptyField = () => {
    setEmptyFieldOpen(() => false);
  };
  const setMovingTrue = () => setIsMoving(() => true);
  const setMovingFalse = () => setIsMoving(() => false);

  const handleAdditionalOpen = (cards: CardsCoordsType) => {
    setAdditionalOpened(cards);
  };

  const handleSetTopLeftAdditional = (coords: FieldLeftTopType) => {
    setTopLeftAdditional(coords);
  };

  const mouseDownHandle = (card: GCard, index: number, cardIndex: number) => {
    mouseHoldTimeout = setTimeout(() => {
      if (card.isOpen && !isMoving) {
        const findCardsArr = gameState.getSelectedCards(index, cardIndex);
        if (!findCardsArr || findCardsArr[0].length == 0) return;
        handleSetGameState(findCardsArr[1]);
        setSelectedLine(() => index);
        selectCardHandle(findCardsArr[0]);
      }
    }, 100);
    handleUnLightAdditional();
  };

  const mouseUpHandle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (selectedCards) {
      const index = gameState.findLineLindex(
        e.clientY,
        e.clientX,
        selectedCards[0]
      );
      if (selectedLine !== undefined) {
        const newGameState = gameState.copyGameState(gameState);

        if (index !== -1) {
          newGameState.lines[index].push(...selectedCards);
          let wasOpened = false;
          if (newGameState.lines[selectedLine].length > 0) {
            wasOpened =
              !newGameState.lines[selectedLine][
                newGameState.lines[selectedLine].length - 1
              ].isOpen;
            newGameState.lines[selectedLine][
              newGameState.lines[selectedLine].length - 1
            ].setOpen();
          }
          const newMove = new Move(
            1,
            selectedLine,
            index,
            selectedCards.length,
            wasOpened
          );
          newGameState.moves.push(newMove);
        } else {
          newGameState.lines[selectedLine].push(...selectedCards);
        }
        handleSetGameState(newGameState);
      }
    }
    setHints(() => undefined);
    selectCardHandle(undefined);
    setMovingFalse();
  };

  const clickOnCard = (card: GCard, indexCard: number, indexLine: number) => {
    if (mouseHoldTimeout) {
      clearTimeout(mouseHoldTimeout);
    }
    handleUnLightAdditional();
    if (isMoving) return;
    if (!card.isOpen) return;

    const searchLine = gameState.findBestMOve(card, indexLine);

    if (searchLine == -1) return;
    const findCardsArr = gameState.getSelectedCards(indexLine, indexCard);
    if (!findCardsArr) return;

    handleSetGameState(findCardsArr[1]);
    let newCoords = { top: 0, left: 0 };
    if (gameState.lines[searchLine].length == 0) {
      newCoords = {
        top: gameState.linesCoords[searchLine].top,
        left: gameState.linesCoords[searchLine].left,
      };
    } else {
      newCoords = {
        top:
          gameState.lines[searchLine][gameState.lines[searchLine].length - 1]
            .top + Math.round(card.height / 5),
        left: gameState.lines[searchLine][
          gameState.lines[searchLine].length - 1
        ].left,
      };
    }

    setMovingTrue();
    setSelfMoving(() => {
      return {
        cards: findCardsArr[0],
        topEnd: newCoords.top,
        leftEnd: newCoords.left,
        lineStart: indexLine,
        lineEnd: searchLine,
        isBack: false,
      };
    });
  };

  const clickOnAdditional = (index: number, coords: FieldLeftTopType) => {
    handleUnLightAdditional();
    if (isMoving) return;
    if (gameState.additional.length - 1 == index) {
      const indexLine = gameState.lines.findIndex((line) => line.length == 0);
      if (indexLine !== -1) {
        onOpenEmptyField();
        return;
      }
      setMovingTrue();
      const additionsList = gameState.additional[index];
      handleAdditionalOpen({ cards: additionsList, coords: coords });
      const newGameState = gameState.copyGameState(gameState);
      newGameState.additional.pop();

      const newMove = new Move(2, -1, -1, 10, false);
      newGameState.moves.push(newMove);
      handleSetGameState(newGameState);
    }
  };

  const hintOnClick = () => {
    handleUnLightAdditional();
    if (isMoving) return;
    if (hints) {
      const count = hints.count == hints.hints.length - 1 ? 0 : hints.count + 1;
      const newGameState = gameState.copyGameState(gameState);
      const cards = gameState.lines[hints.hints[count].index].splice(
        gameState.lines[hints.hints[count].index].length -
          hints.hints[count].countCards
      );
      const top = !hints.hints[count].cardToMove
        ? gameState.linesCoords[hints.hints[count].moveToIndex].top
        : hints.hints[count].cardToMove!.top +
          Math.round(hints.hints[count].cardToMove!.height / 5);
      const left = !hints.hints[count].cardToMove
        ? gameState.linesCoords[hints.hints[count].moveToIndex].left
        : hints.hints[count].cardToMove!.left;
      const startIndex = hints.hints[count].index;
      const movingHint = {
        cards,
        top,
        left,
        startIndex,
      };
      setMovingTrue();
      setMovingHint(() => movingHint);
      setHints({ ...hints, count });
      handleSetGameState(newGameState);
    } else {
      const arr = gameState.findHint();
      if (arr.length > 0) {
        const newGameState = gameState.copyGameState(gameState);
        const cards = gameState.lines[arr[0].index].splice(
          gameState.lines[arr[0].index].length - arr[0].countCards
        );
        const top = !arr[0].cardToMove
          ? gameState.linesCoords[arr[0].moveToIndex].top
          : arr[0].cardToMove.top + Math.round(arr[0].cardToMove.height / 5);
        const left = !arr[0].cardToMove
          ? gameState.linesCoords[arr[0].moveToIndex].left
          : arr[0].cardToMove.left;
        const startIndex = arr[0].index;
        const movingHint = {
          cards,
          top,
          left,
          startIndex,
        };
        setMovingTrue();
        setMovingHint(() => movingHint);
        setHints(() => {
          return { hints: arr, count: 0 };
        });
        handleSetGameState(newGameState);
      } else {
        handleLightAdditional();
      }
    }
  };

  const undoFirst = (lastMove: Move, newGameState: GameState) => {
    const findCardsArr = newGameState.getSelectedCards(
      lastMove.endLine,
      newGameState.lines[lastMove.endLine].length - lastMove.numberOfCards
    );
    if (!findCardsArr) return;
    if (lastMove.wasOpened) {
      findCardsArr[1].lines[lastMove.startLine][
        findCardsArr[1].lines[lastMove.startLine].length - 1
      ].setClose();
    }
    handleSetGameState(findCardsArr[1]);
    let newCoords = { top: 0, left: 0 };
    const searchLine = lastMove.startLine;
    if (newGameState.lines[searchLine].length == 0) {
      newCoords = {
        top: gameState.linesCoords[searchLine].top,
        left: gameState.linesCoords[searchLine].left,
      };
    } else {
      newCoords = {
        top:
          gameState.lines[searchLine][gameState.lines[searchLine].length - 1]
            .top +
          Math.round(
            gameState.lines[searchLine][gameState.lines[searchLine].length - 1]
              .height / 5
          ),
        left: gameState.lines[searchLine][
          gameState.lines[searchLine].length - 1
        ].left,
      };
    }
    setSelfMoving(() => {
      return {
        cards: findCardsArr[0],
        topEnd: newCoords.top,
        leftEnd: newCoords.left,
        lineStart: lastMove.endLine,
        lineEnd: searchLine,
        isBack: true,
      };
    });
    setMovingTrue();
    handleSetGameState(newGameState);
  };

  const undoSecond = (newGameState: GameState) => {
    let coordsBack = topLeftAdditional;
    if (
      newGameState.additional.length > 0 &&
      newGameState.additional[0].length > 0
    ) {
      const count = newGameState.additional.length;
      coordsBack = { left: coordsBack.left + count * 20, top: coordsBack.top };
    }

    const additionalLine: GCard[] = [];
    newGameState.lines.forEach((item) => {
      const card = item.pop();
      if (card) {
        card.setClose();
        additionalLine.push(card);
      }
    });
    setMovingTrue();
    setAdditionalOpenedBack(() => {
      return {
        cards: additionalLine,
        coords: coordsBack,
      };
    });
    handleSetGameState(newGameState);
  };

  const undoThird = (newGameState: GameState, solvedMove: Move) => {
    if (newGameState.fullCells[0].length == 0) return;
    const lastMove = newGameState.moves.pop();
    if (!lastMove) return;
    const solvedCards = newGameState.fullCells.pop();
    if (!newGameState.fullCells[0]) newGameState.fullCells[0] = [];

    if (!solvedCards || solvedCards.length == 0) return;
    const movingCards = solvedCards.splice(
      solvedCards.length - lastMove.numberOfCards
    );
    if (!movingCards || movingCards.length == 0) return;
    if (solvedMove.wasOpened) {
      newGameState.lines[solvedMove.startLine][
        newGameState.lines[solvedMove.startLine].length - 1
      ].setClose();
    }

    if (lastMove.wasOpened) {
      newGameState.lines[lastMove.startLine][
        newGameState.lines[lastMove.startLine].length - 1
      ].setClose();
    }
    newGameState.lines[lastMove.endLine].push(...solvedCards);

    handleSetGameState(newGameState);
    let newCoords = { top: 0, left: 0 };
    const searchLine = lastMove.startLine;
    if (newGameState.lines[searchLine].length == 0) {
      newCoords = {
        top: gameState.linesCoords[searchLine].top,
        left: gameState.linesCoords[searchLine].left,
      };
    } else {
      newCoords = {
        top:
          gameState.lines[searchLine][gameState.lines[searchLine].length - 1]
            .top +
          Math.round(
            gameState.lines[searchLine][gameState.lines[searchLine].length - 1]
              .height / 5
          ),
        left: gameState.lines[searchLine][
          gameState.lines[searchLine].length - 1
        ].left,
      };
    }

    setMovingTrue();

    setSelfMoving(() => {
      return {
        cards: movingCards,
        topEnd: newCoords.top,
        leftEnd: newCoords.left,
        lineStart: lastMove.endLine,
        lineEnd: searchLine,
        isBack: true,
      };
    });

    handleSetGameState(newGameState);
  };

  const clickOnUndo = () => {
    handleUnLightAdditional();
    if (isMoving) return;
    if (gameState.moves.length == 0) return;
    const newGameState = gameState.copyGameState(gameState);
    const lastMove = newGameState.moves.pop();

    if (!lastMove) return;
    if (lastMove.moveType == 1) {
      undoFirst(lastMove, gameState);
    } else if (lastMove.moveType == 2) {
      undoSecond(newGameState);
    } else if (lastMove.moveType == 3) {
      undoThird(newGameState, lastMove);
    }
  };

  useEffect(() => {
    if (selfMoving) {
      setTimeout(() => {
        const newGameState = gameState.copyGameState(gameState);
        newGameState.lines[selfMoving.lineEnd].push(...selfMoving.cards);
        let wasOpened = false;

        if (newGameState.lines[selfMoving.lineStart].length !== 0) {
          wasOpened =
            !newGameState.lines[selfMoving.lineStart][
              newGameState.lines[selfMoving.lineStart].length - 1
            ].isOpen;
          newGameState.lines[selfMoving.lineStart][
            newGameState.lines[selfMoving.lineStart].length - 1
          ].setOpen();
        }

        if (!selfMoving.isBack) {
          const newMove = new Move(
            1,
            selfMoving.lineStart,
            selfMoving.lineEnd,
            selfMoving.cards.length,
            wasOpened
          );
          newGameState.moves.push(newMove);
        }
        setSelfMoving(() => undefined);
        setHints(() => undefined);
        handleSetGameState(newGameState);
        setMovingFalse();
      }, 500);
    }
  }, [selfMoving]);

  useEffect(() => {
    if (additionalOpened) {
      setTimeout(() => {
        const newGameState = gameState.copyGameState(gameState);
        additionalOpened.cards.forEach((card, index) => {
          card.setOpen();
          newGameState.lines[index].push(card);
        });
        setAdditionalOpened(() => undefined);
        setHints(() => undefined);
        handleSetGameState(newGameState);
        setMovingFalse();
      }, 500);
    }
  }, [additionalOpened]);

  useEffect(() => {
    if (additionalOpenedBack) {
      setTimeout(() => {
        const newGameState = gameState.copyGameState(gameState);
        if (
          newGameState.additional[0] &&
          newGameState.additional[0].length == 0
        ) {
          newGameState.additional[0] = additionalOpenedBack.cards;
        } else newGameState.additional.push(additionalOpenedBack.cards);
        setAdditionalOpenedBack(() => undefined);
        setHints(() => undefined);
        handleSetGameState(newGameState);
        setMovingFalse();
      }, 500);
    }
  }, [additionalOpenedBack]);

  useEffect(() => {
    const gameData = gameState.getState();
    localStorage.setItem("spider", JSON.stringify(gameData));

    const indexLine = gameState.findSolvedCards();
    if (indexLine !== -1) {
      const newGameState = gameState.copyGameState(gameState);
      const solvedCards = newGameState.lines[indexLine].splice(
        newGameState.lines[indexLine].length - 13,
        13
      );
      let wasOpened = false;
      if (newGameState.lines[indexLine].length > 0) {
        wasOpened =
          !newGameState.lines[indexLine][
            newGameState.lines[indexLine].length - 1
          ].isOpen;
        newGameState.lines[indexLine][
          newGameState.lines[indexLine].length - 1
        ].setOpen();
      }
      const newMove = new Move(3, indexLine, indexLine, 13, wasOpened);
      newGameState.moves.push(newMove);
      setSolvedCards(() => solvedCards);
      handleSetGameState(newGameState);
    }
    const arrHints = gameState.findHint();
    if (arrHints.length == 0 && !isMoving && !gameState.additional[0]) {
      handleSetIsGameOver();
      handleOpen();
      return;
    }
  }, [gameState]);

  useEffect(() => {
    if (solvedCards) {
      setTimeout(() => {
        const newGameState = gameState.copyGameState(gameState);
        if (newGameState.fullCells[0].length == 0)
          newGameState.fullCells[0] = [...solvedCards];
        else {
          newGameState.fullCells.push([...solvedCards]);
        }
        setSolvedCards(() => undefined);
        setHints(() => undefined);
        handleSetGameState(newGameState);
        setMovingFalse();
      }, 500);
    }
  }, [solvedCards]);

  useEffect(() => {
    if (movigHint) {
      setTimeout(() => {
        const newGameState = gameState.copyGameState(gameState);
        newGameState.lines[movigHint.startIndex].push(...movigHint.cards);
        setMovingHint(() => undefined);
        handleSetGameState(newGameState);
        setMovingFalse();
      }, 500);
    }
  }, [movigHint]);

  return (
    <div className="w-full">
      <div className="w-full flex items-start gap-x-2 pl-4">
        <Button
          className="flex items-center gap-x-2 bg-teal-400"
          onClick={handleOpen}
        >
          New Game
          <Gamepad2 />
        </Button>
        <Button
          className="flex items-center gap-x-2 bg-teal-400"
          onClick={clickOnUndo}
        >
          Undo
          <Undo2 />
        </Button>
        <Button
          className="flex items-center gap-x-2 bg-teal-400"
          onClick={hintOnClick}
        >
          Hint
          <Lightbulb />
        </Button>
      </div>
      <div className="w-full flex justify-between">
        <div className="m-3 rounded-xl relative">
          <StopCardComponent
            handleSetTopLeftAdditional={handleSetTopLeftAdditional}
            gameState={gameState}
          />
          {gameState.additional.map((item, index) => (
            <AdditionalLine
              index={index}
              line={item}
              key={index}
              gameState={gameState}
              clickOnAdditional={clickOnAdditional}
              lightAdditional={lightAdditional}
            />
          ))}
        </div>
        <div className="flex justify-around m-3 w-9/12">
          {[...Array(8)].map((_, index) => (
            <SolvedCardsComponent
              key={index}
              indexLine={index}
              gameState={gameState}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-around w-full mt-2">
        {[...Array(10)].map((_, indexLine) => (
          <div
            key={indexLine}
            className="relative"
            style={{ width: "6vw", height: "8vw" }}
          >
            <div className="absolute" style={{ top: 0 }}>
              <EmptyCardComponent indexLine={indexLine} gameState={gameState} />
            </div>
            {gameState.lines[indexLine].map((cart, index) => {
              const space =
                gameState.lines[indexLine].length > 19
                  ? Math.round(cart.height / 10)
                  : Math.round(cart.height / 5);
              const top = index * space;
              return (
                <div
                  onClick={() => clickOnCard(cart, index, indexLine)}
                  onMouseDown={() => mouseDownHandle(cart, indexLine, index)}
                  key={index}
                  className="absolute"
                  style={{ top }}
                >
                  <CardComponent card={cart} gameState={gameState} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {selfMoving ? (
        <SelfMovingLineComponent
          cardLine={selfMoving.cards}
          topEnd={selfMoving.topEnd}
          leftEnd={selfMoving.leftEnd}
          gameState={gameState}
        />
      ) : null}
      {(selectedCards && mouseCoords) ? (
        <SelectedCardsComponent
          cards={selectedCards}
          mouseUpHandle={mouseUpHandle}
          mouseCoords={mouseCoords}
        />
      ) : null}
      {additionalOpened &&
        additionalOpened.cards.length > 0 &&
        additionalOpened.cards.map((card, index) => {
          card.setOpen();
          return (
            <MovingCard
              gameState={gameState}
              key={index}
              indexLine={index}
              card={card}
              coorStart={additionalOpened.coords}
              coorEnd={{
                top:
                  gameState.lines[index][gameState.lines[index].length - 1]
                    .top + Math.round(card.height / 5),
                left: gameState.lines[index][gameState.lines[index].length - 1]
                  .left,
              }}
            />
          );
        })}
      {additionalOpenedBack &&
        additionalOpenedBack.cards.length > 0 &&
        additionalOpenedBack.cards.map((card, index) => {
          card.setClose();
          return (
            <MovingCard
              key={index}
              indexLine={index}
              card={card}
              coorStart={{ left: card.left, top: card.top }}
              coorEnd={{
                top: additionalOpenedBack.coords.top,
                left: additionalOpenedBack.coords.left,
              }}
              gameState={gameState}
            />
          );
        })}
      {solvedCards
        ? solvedCards.map((card, index) => (
            <MovingCard
              key={index}
              indexLine={index}
              card={card}
              coorStart={{ top: card.top, left: card.left }}
              coorEnd={{
                top: gameState.findPossibleEmptyTop(),
                left: gameState.findPossibleEmptyLeft(),
              }}
              gameState={gameState}
            />
          ))
        : null}

      {movigHint && hints ? (
        <SelfMovingLineComponent
          cardLine={movigHint.cards}
          topEnd={movigHint.top}
          leftEnd={movigHint.left}
          gameState={gameState}
        />
      ) : null}

      <ModalEmptyRow open={emptyFieldModal} onClose={onCloseEmptyField} />
    </div>
  );
};

export default SpiderField;
