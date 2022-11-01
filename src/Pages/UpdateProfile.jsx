import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const UpdateProfile = () => {
  const { currentUser, updateProfileInfo, username, user } = useAuth();

  const [img, setImg] = useState(currentUser.photoURL);

  function changeHandler(e) {
    const myToast = toast.loading("Uploading...");
    const imgValue = e.target.files[0];
    const uploadImg = async () => {
      const imgRef = ref(storage, `avatar/${currentUser.uid}`);
      try {
        const snap = await uploadBytes(imgRef, imgValue);
        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        console.log(url);
        await updateDoc(doc(db, "users", currentUser.uid), {
          photoURL: url,
        });

        updateProfileInfo({ photoURL: url })
          .then(() => {
            setImg(url);
            toast.success("Uploaded SuccessFully", { id: myToast });
          })
          .catch((err) => console.log(err, "its about update profile"));
      } catch (err) {
        toast.error("Failed to Upload", { id: myToast });
      }
    };
    uploadImg();
  }

  return !currentUser ? (
    <Navigate to="/" />
  ) : user && !user.username ? (
    <Navigate to="/username" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form className="flex flex-col items-center bg-white drop-shadow-xl py-6 px-8 rounded-md w-80 border border-gray-300">
        <h2 className="text-3xl font-semibold mb-5">Profile</h2>
        <label htmlFor="photo">
          <img
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-400 cursor-pointer"
            src={img}
            alt=""
          />
        </label>
        <input
          type="file"
          onChange={changeHandler}
          id="photo"
          className="hidden"
        />

        <h2 className="text-xl mt-2 mb-4">{currentUser.email}</h2>
        <h2 className="text-md mt-2">
          {`Joined on: ${new Date(
            parseInt(currentUser.metadata.createdAt)
          ).toDateString()}`}
        </h2>
        <div className="flex mt-5 items-center">
          <h2>Username: {username}</h2>
          <Link to={"/username"}>
            <p className=" text-blue-600 underline ml-2">change</p>
          </Link>
        </div>
      </form>
      <Link to={"/dashboard"}>
        <p className="mt-5 text-blue-600 underline">Cancel</p>
      </Link>
    </div>
  );
};

export default UpdateProfile;
