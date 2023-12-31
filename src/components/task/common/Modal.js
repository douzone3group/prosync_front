import { styled } from "styled-components";
import ReactDOM from "react-dom";

const portalElement = document.getElementById("overlays");

export default function Modal({ children, onClose }) {
  return (
    <>
      {ReactDOM.createPortal(<BackDrop onClick={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <StatusModal open={true}>{children}</StatusModal>,
        portalElement
      )}
    </>
  );
}

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
`;

const StatusModal = styled.dialog`
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  overflow: hidden;
  z-index: 2;
  border: none;
  /* top: 250px; */

  position: fixed;
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%);
`;
