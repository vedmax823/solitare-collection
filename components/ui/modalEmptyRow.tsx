"use client";

import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";
import IconButton from "./icon-button";
import Button from "./button";



interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalEmptyRow: React.FC<ModalProps> = ({
  open,
  onClose,
}) => {


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
                      Spider
                    </h1>
                  </div>
                  <div className="w-full flex justify-center mt-4">
                    <p className="text-xl font-semibold">
                    There must be at least one card in each column. 
                    </p>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    <Button className="bg-green-600" onClick={onClose}>
                      OK
                    </Button>

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

export default ModalEmptyRow;
