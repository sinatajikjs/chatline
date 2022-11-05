import { useEffect, useRef } from "react";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useGesture } from "react-use-gesture";

const ImgModal = ({ src, setImgModal }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });

  const imgRef = useRef();

  useGesture(
    {
      onDrag: (props) => {
        const {
          delta: [dx, dy],
        } = props;
        if (crop.scale === 1) return;
        setCrop((crop) => ({ ...crop, x: crop.x + dx, y: crop.y + dy }));
      },
      onPinch: ({ delta: [d] }) => {
        const newScale = crop.scale + d / 100;
        setCrop((crop) => ({ ...crop, scale: newScale > 1 ? newScale : 1 }));
        if (crop.scale === 1) setCrop((crop) => ({ ...crop, x: 0, y: 0 }));
      },
    },
    { domTarget: imgRef, eventOptions: { passive: false } }
  );

  const closeHandler = () => {
    modalRef.current.style.opacity = "0";
    setTimeout(() => {
      setImgModal(false);
    }, 1);
  };

  useEffect(() => {
    setTimeout(() => {
      modalRef.current.style.opacity = "1";
    }, 10);
  }, []);

  const modalRef = useRef();

  function doubleClickHandler() {
    if (crop.scale === 1) {
      setCrop((crop) => ({ ...crop, scale: 3 }));
    } else {
      setCrop({ x: 0, y: 0, scale: 1 });
    }
  }

  return (
    <div
      ref={modalRef}
      className="bg-black h-screen w-screen relative z-30 flex justify-center items-center transition-all opacity-0"
    >
      <div className="absolute z-10 top-0 bg-[#00000099] w-full h-14 flex justify-end items-center">
        <IoCloseOutline
          onClick={closeHandler}
          className="text-white text-4xl cursor-pointer mr-2"
        />
      </div>
      <img
        style={{
          left: crop.x,
          top: crop.y,
          transform: `scale(${crop.scale})`,
          touchAction: "none",
        }}
        ref={imgRef}
        onDoubleClick={doubleClickHandler}
        className="h-full w-full relative object-contain"
        src={src}
      />
    </div>
  );
};

export default ImgModal;
