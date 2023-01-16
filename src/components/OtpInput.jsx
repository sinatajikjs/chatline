import React, { useEffect, useRef, useState } from "react";

let currentOTPIndex = 0;

const OTPField = ({ otp, setOtp, setError, error, ...props }) => {
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);

  function changeHandler({ target }) {
    setError(false);
    const { value } = target;
    const newOtp = [...otp];
    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else if (activeOTPIndex < 5) setActiveOTPIndex(currentOTPIndex + 1);
    else inputRef.current.blur();

    newOtp[currentOTPIndex] = value.substring(value.length - 1);
    setOtp(newOtp);
  }
  function keyDownHandler({ key }, index) {
    currentOTPIndex = index;
    if (key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  }

  function handlePaste(e) {
    e.preventDefault();
    setError(false);
    let paste = (e.clipboardData || window.clipboardData).getData("text");
    const newOtp = [];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = paste[i];
      setOtp(newOtp);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setOtp(new Array(6).fill(""));
        setActiveOTPIndex(0);
        currentOTPIndex = 0;
      }, 300);
    }
  }, [error]);

  const inputRef = useRef();

  return (
    <div className="mt-8">
      <div className="flex justify-center items-center space-x-2 ">
        {otp.map((_, index) => {
          return (
            <input
              {...props}
              key={index}
              ref={index === activeOTPIndex ? inputRef : null}
              onChange={changeHandler}
              onPaste={handlePaste}
              autoComplete="false"
              value={otp[index]}
              onKeyDown={(e) => keyDownHandler(e, index)}
              type="number"
              className={`w-9 h-12 border-2 rounded-lg bg-transparent outline-none text-center font-semibold text-xl ${
                error ? "border-red-400" : "border-gray-400"
              } focus:border-primary focus:text-black text-gray-400 transition otp-input`}
            />
          );
        })}
      </div>
      <p
        className={`text-red-500 mt-1 transition ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error}
      </p>
    </div>
  );
};

export default OTPField;
