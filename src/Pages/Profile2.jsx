import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const { currentUser, updateProfileInfo, user } = useAuth();

  const [img, setImg] = useState(currentUser.photoURL);

  const navigate = useNavigate();

  function changeHandler(e) {
    const myToast = toast.loading("Uploading...");
    const imgValue = e.target.files[0];
    const uploadImg = async () => {
      const imgRef = ref(storage, `avatar/${currentUser.uid}`);
      try {
        const snap = await uploadBytes(imgRef, imgValue);
        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        await updateDoc(doc(db, "users", currentUser.uid), {
          photoURL: url,
        });

        updateProfileInfo({ photoURL: url })
          .then(() => {
            setImg(url);
            toast.success("Uploaded SuccessFully", { id: myToast });
            navigate("/");
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
      <form className="flex flex-col items-end bg-white drop-shadow-xl rounded-md w-max border border-gray-300">
        <Link className="text-lg text-blue-500 mx-3" to={"/"}>
          skip
        </Link>
        <div className="flex flex-col items-center py-5 px-8">
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

          <h2 className="text-lg mt-3">Upload a Profile Picture...</h2>
        </div>
      </form>
    </div>
  );
};

export default Profile;
