import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const Profile = () => {
  const { user, updateProfile, checkUsername } = useAuth();

  const [img, setImg] = useState(user?.photoURL);
  const [loading, setLoading] = useState(false);
  const [usernameValue, setUsernameValue] = useState(user?.username);

  const nameRef = useRef();
  const bioRef = useRef();
  const fileRef = useRef();

  const navigate = useNavigate();

  async function imgChangeHandler(e) {
    const myToast = toast.loading("Uploading image...");
    setLoading(true);

    const imgValue = e.target.files[0];
    const imgRef = ref(storage, `avatar/${user.phoneNumber}`);
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

  const usernameChangeHandler = (e) => {
    let myToast;
    toast.dismiss(myToast);
    if (!Boolean(e.target.value.match(/^[A-Za-z0-9._ ]*$/))) {
      return (myToast = toast.error(
        "Only letters, numbers, periods and underscores is accepted"
      ));
    }
    setUsernameValue(e.target.value.toLowerCase().replaceAll(" ", "_"));
  };

  async function submitHandler(e) {
    e.preventDefault();
    if (usernameValue.length < 5)
      return toast.error("Username must be more than 4 letters");
    setLoading(true);
    if (user) {
      const myToast = toast.loading("Updating...");

      // update profile
      const userExist = await checkUsername(usernameValue);
      if (userExist) {
        setLoading(false);
        return toast.error("Username is Taken", { id: myToast });
      }

      updateProfile(
        nameRef.current.value,
        usernameValue,
        bioRef.current.value,
        img
      ).then(() => {
        setLoading(false);
        toast.success("Updated SuccessFully", { id: myToast });
        navigate("/");
      });
    }
  }

  return !user ? (
    <Navigate to="/login" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center bg-white drop-shadow-xl rounded-md w-max border border-gray-300 px-8 py-5"
      >
        <div className="flex flex-col items-center mb-5">
          <label htmlFor="photo">
            <img
              className="w-24 h-24 object-cover rounded-full border-2 border-gray-400 cursor-pointer"
              src={img || "/user.jpg"}
              alt=""
            />
          </label>
          <input
            type="file"
            ref={fileRef}
            onChange={imgChangeHandler}
            id="photo"
            className="hidden"
          />
        </div>
        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="name">Username</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="text"
            required
            value={usernameValue}
            onChange={usernameChangeHandler}
            name="name"
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
          {user ? "Update" : "Finish"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
