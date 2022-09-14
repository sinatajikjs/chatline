import { storage } from "../firebase";
import { useAuth } from "../Context/AuthContext";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ChangePicture = () => {
  const { currentUser, updatePhotoUrl } = useAuth();
  const navigate = useNavigate();

  async function clickHandler() {
    const file = fileRef.current.files[0];
    console.log(currentUser);
    if (!file) return toast.error("select a file");
    const myToast = toast.loading("Uploading...");
    const storageRef = ref(
      storage,
      `profiles/${currentUser.uid}/${currentUser.uid}`
    );

    await uploadBytesResumable(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updatePhotoUrl({
            photoURL: url,
          })
            .then(() => {
              console.log("done");
              navigate("/dashboard");
              console.log(currentUser.photoURL);
            })
            .catch((err) => console.log(err));

          console.log(url);
          toast.success("Uploaded SuccessFully", { id: myToast });
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to Upload", { id: myToast });
      });
  }

  const fileRef = useRef();

  return !currentUser ? (
    <Navigate to="/" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white drop-shadow-xl rounded-md w-96 border border-gray-300 p-5">
      <img
        src={currentUser.photoURL}
        className="w-20 h-20 rounded-full border-2 border-gray-300 "
      />
      <div className="flex items-center mt-4 w-80">
        <input type="file" ref={fileRef} />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded text-lg"
          onClick={clickHandler}
        >
          Upload
        </button>
      </div>
      <Link to={"/dashboard"}>
        <p className="mt-2 text-blue-600 underline">Cancel</p>
      </Link>
    </div>
  );
};

export default ChangePicture;
