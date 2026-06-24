// external libraries
import { useEffect, useRef } from "react";

// css
import "../styles/PopUp.scss"

// you should initialize the popup state using this type
export type PopUpState<T> = {isOpen: boolean, data: T};

// a popup that opens when modalState is true and locks the webpage
// the modalState needs to be a state, that is, a value initialized by useState(false)
export default function PopUp(props: { modalState: boolean, children?: React.ReactNode }) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (props.modalState == true) {
      modalRef.current?.showModal();
      return;
    }
    modalRef.current?.close();
  });
  
  return(
    <>
      <dialog ref={modalRef} className="popup">
        {props.children}
      </dialog>
    </>
  )
}
