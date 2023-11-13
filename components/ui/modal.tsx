"use client";

import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import IconButton from "./icon-button";
import Button from "./button";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { GameState, SuiutsEnum } from "@/models/game-state";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  isGameOver: boolean;
  handleSetSuitsCount: (count: SuiutsEnum) => void;
  countOfSuits: SuiutsEnum;
  handleSetGameState: (gameState: GameState) => void;
  isWon: boolean;
  // handleGameOver: () => void;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  isGameOver,
  handleSetSuitsCount,
  countOfSuits,
  handleSetGameState,
  isWon,
}) => {
  const startNewGame = () => {
    handleSetGameState(new GameState(countOfSuits));
    onClose();
  };
  const headerText = isWon
    ? "Congratulations! You are winner!"
    : isGameOver
      ? "No more moves"
      : "Do you realy want to start a new game?";

  const secondButtonText = isGameOver ? "Go back and undo some moves" : "Continue this game"

  const activeBorder = "border-green-600 border-4 border-solid hover:border-green-600";

  return (
    <Transition show={open} appear as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl overflow-hidden rounded-lg text-left align-middle">
                <div className="relative flex w-full flex-col items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <div className="absolute right-4 top-4">
                    <IconButton onClick={onClose} icon={<X size={15} />} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-amber-600">
                      {headerText}
                    </h1>
                  </div>
                  <div className="w-full flex justify-around flex-col md:flex-row flex-wrap items-center">
                    <div
                      className={cn(
                        "relative w-5/12 flex flex-col items-center p-3 border-4 rounded-xl border-solid mt-2 hover:border-green-400",
                        countOfSuits == 1 ? activeBorder : ""
                      )}
                      onClick={() => handleSetSuitsCount(1)}
                    >
                      <Image
                        src="/images/oneSuit.png"
                        alt="One suit"
                        width="320"
                        height="150"
                      />
                      <span className="text-xl font-semibold w-fit mt-2">
                        One suit
                      </span>
                    </div>
                    <div
                      className={cn(
                        "relative w-5/12 flex flex-col items-center p-3 border-4 rounded-xl border-solid mt-2 hover:border-green-400",
                        countOfSuits == 2 ? activeBorder : ""
                      )}
                      onClick={() => handleSetSuitsCount(2)}
                    >
                      <Image
                        src="/images/twoSuits.png"
                        alt="Two suits"
                        width="320"
                        height="150"
                      />
                      <span className="text-xl font-semibold mt-2  w-fit">
                        Two suits
                      </span>
                    </div>
                    {/* <div className={cn("relative w-1/2 flex flex-col items-center p-3", activeBorder)}> */}
                    <div
                      className={cn(
                        "relative w-5/12 flex flex-col items-center p-3 border-4 rounded-xl border-solid mt-2 hover:border-green-400",
                        countOfSuits == 4 ? activeBorder : ""
                      )}
                      onClick={() => handleSetSuitsCount(4)}
                    >
                      <Image
                        src="/images/fourSuits.png"
                        alt="Four suits"
                        width="320"
                        height="150"
                      />
                      <span className="text-xl font-semibold w-fit mt-2">
                        Four suits
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    <Button className="bg-green-600" onClick={startNewGame}>
                      Start new game
                    </Button>
                    { !isWon && 
                      <Button className="bg-green-600" onClick={onClose}>
                        {secondButtonText}
                      </Button>
                    }
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
