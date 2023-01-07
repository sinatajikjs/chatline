import OTPField from "../components/OtpInput";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const VerifyCode = ({ inputValue, setCodeSent }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [path, setPath] = useState("/");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { confirmOTP, user } = useAuth();

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", inputValue));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) setPath("/profile");
    });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const value = otp.join("");
    if (value.length === 6) {
      setLoading(true);
      confirmOTP(value).catch((err) => {
        setLoading(false);
        switch (err.code) {
          case "auth/invalid-verification-code":
            setError("Invalid code");
            break;
          case "auth/network-request-failed":
            setError("Network error");
            break;
        }
      });
    }
  }, [otp]);

  useEffect(() => {
    if (user) navigate(path);
  }, [user]);

  return (
    <div className="flex justify-center">
      <div className="mt-16 flex flex-col items-center mx-6">
        <img className="w-40" src="/logo.svg" />
        <div className="mt-10 flex items-center">
          <h1 className="text-3xl font-semibold">{inputValue}</h1>
          <IconButton onClick={() => setCodeSent(false)} className="ml-1">
            <ModeEditOutlineOutlinedIcon className="text-gray-500 text-xl" />
          </IconButton>
        </div>
        <p className="mt-2 text-center text-gray-500">
          We've sent the code to your phone number
        </p>
        <OTPField setOtp={setOtp} otp={otp} setError={setError} error={error} />
        <LoadingButton
          className="mt-6"
          size="large"
          disabled
          variant="contained"
          loading={loading}
          type="submit"
          fullWidth
        >
          next
        </LoadingButton>
      </div>
    </div>
  );
};

export default VerifyCode;
