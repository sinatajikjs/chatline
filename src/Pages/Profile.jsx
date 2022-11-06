import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import userAvatar from "../assets/user.jpg";
import { useAuth } from "../Context/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Profile = ({ emailPass }) => {
  const { currentUser, signup, user } = useAuth();

  const [img, setImg] = useState(currentUser?.photoURL);
  const [loading, setLoading] = useState(false);
  // const [user, setUser] = useState(null);

  const nameRef = useRef();
  const usernameRef = useRef();
  const bioRef = useRef();
  const fileRef = useRef();

  const navigate = useNavigate();

  async function changeHandler(e) {
    const myToast = toast.loading("Uploading image...");
    setLoading(true);

    const imgValue = e.target.files[0];
    const imgRef = ref(storage, `avatar/${emailPass.email}`);
    try {
      const snap = await uploadBytes(imgRef, imgValue);
      const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
      setImg(url);
      setLoading(false);
      toast.success("Uploaded SuccessFully", { id: myToast });
    } catch (err) {
      toast.error("Failed to Upload", { id: myToast });
    }
  }

  function submitHandler(e) {
    e.preventDefault();
    setLoading(true);
    if (currentUser) {
      // update profile
      const myToast = toast.loading("Updating...");
      const usersRef = doc(db, "users", currentUser.uid);
      return updateDoc(usersRef, {
        fullName: nameRef.current.value,
        username: usernameRef.current.value,
        bio: bioRef.current.value,
      }).then(() => {
        setLoading(false);
        toast.success("Updated SuccessFully", { id: myToast });
        navigate("/");
      });
    } else {
      signup(
        nameRef.current.value,
        emailPass.email,
        emailPass.password,
        img,
        usernameRef.current.value,
        bioRef.current.value
      ).then(() => setLoading(false));
    }
  }


  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center bg-white drop-shadow-xl rounded-md w-max border border-gray-300 px-8 py-5"
      >
        <div className="flex flex-col items-center mb-5">
          <label htmlFor="photo">
            <img
              className="w-24 h-24 object-cover rounded-full border-2 border-gray-400 cursor-pointer"
              src={img || userAvatar}
              alt=""
            />
          </label>
          <input
            type="file"
            ref={fileRef}
            onChange={changeHandler}
            id="photo"
            className="hidden"
          />
        </div>
        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="name">Username</label>
          <input
            defaultValue={user?.username}
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="text"
            required
            name="name"
            ref={usernameRef}
          />
        </div>
        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="name">Fullname</label>
          <input
            defaultValue={user?.fullName}
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="text"
            required
            name="name"
            ref={nameRef}
          />
        </div>
        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="name">Bio</label>
          <input
            defaultValue={user?.bio}
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="text"
            ref={bioRef}
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 ${
            loading ? "opacity-50" : "opacity-100"
          } text-white px-2 py-1 rounded text-lg mt-4 w-full`}
          disabled={loading}
        >
          {currentUser ? "Update" : "Finish"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
