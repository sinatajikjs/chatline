import { Avatar, TextField, IconButton } from "@mui/material";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import DoneIcon from "@mui/icons-material/Done";
import { useAuth } from "../Context/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const Profile = () => {
  const { user, updateProfile, checkUsername, setIsProfileOpen } = useAuth();

  const [loading, setLoading] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("");

  const [firstNameValue, setFirstNameValue] = useState(user?.firstName);
  const [lastNameValue, setLastNameValue] = useState(user?.lastName);
  const [bioValue, setBioValue] = useState(user?.bio);
  const [usernameValue, setUsernameValue] = useState(user?.username);
  const [photoURL, setPhotoURL] = useState(user?.photoURL);
  const [imgFile, setImgFile] = useState(null);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const someQueryParam = searchParams.get("redirect")?.replace(" ", "+");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstNameValue) return setFirstNameError(true);

    setLoading(true);
    let url;
    if (imgFile) {
      const avatarRef = ref(storage, `avatar/${user.uid}`);
      const snap = await uploadBytes(avatarRef, imgFile);
      url = await getDownloadURL(ref(storage, snap.ref.fullPath));
    }
    await updateProfile(
      firstNameValue,
      lastNameValue,
      usernameValue,
      bioValue,
      url || photoURL
    );
    setLoading(false);

    navigate("/" + (someQueryParam || ""));

    setIsProfileOpen(false);
  }

  async function handleChange({ target }) {
    const value = target.value.toLowerCase().replaceAll(" ", "_");
    if (!Boolean(value.match(/^[A-Za-z0-9_]*$/))) return;
    setUsernameValue(value);

    if (value === "") {
      setUsernameStatus("");
      return setUsernameError(false);
    }

    if (value.length < 5) {
      return setUsernameError("Usernames must have at least 5 characters.");
    }

    setUsernameError(false);
    setUsernameStatus("checking...");

    const isUsernameAvailable = await checkUsername(value);
    if (!isUsernameAvailable)
      return setUsernameError("This username is already taken.");
    setUsernameStatus("Username is available.");
    setUsernameError(false);
  }

  return !user ? (
    <Navigate to="/login" />
  ) : (
    <div
      className={`${
        !user.isNewUser ? "tablet:w-96" : ""
      } flex justify-center h-screen tablet:overflow-scroll`}
    >
      <form
        autoComplete="false"
        noValidate
        onSubmit={handleSubmit}
        className={`${
          user.isNewUser ? "w-96" : "w-full"
        } mx-6 flex flex-col items-center pb-16`}
      >
        {!user.isNewUser && (
          <div className="flex self-start bg-white z-20 py-2 items-center fixed left-0 pl-2 tablet:w-96 w-full">
            <div onClick={() => setIsProfileOpen(false)}>
              <IconButton aria-label="Go back">
                <ArrowBackIcon className="" />
              </IconButton>
            </div>
            <div>
              <h2 className="ml-2 text-xl font-medium">Edit profile</h2>
            </div>
          </div>
        )}
        <label className="mt-14" htmlFor="avatar">
          <Avatar className="bg-primary w-28 h-28 relative cursor-pointer">
            <img
              className="rounded-full w-28 h-28 object-cover"
              src={photoURL}
            />
            {photoURL && <div className="w-28 h-28 bg-modalBg absolute" />}
            <AddAPhotoOutlinedIcon className="text-5xl absolute hover:scale-110 transition" />
          </Avatar>
        </label>
        <input
          type="file"
          onChange={(e) => {
            setPhotoURL(URL.createObjectURL(e.target.files[0]));
            setImgFile(e.target.files[0]);
          }}
          id="avatar"
          className="hidden"
        />
        <h2 className="mt-4 text-2xl">Profile info</h2>
        <p className="mt-2 text-textSecondary text-center">
          Enter your name and add a profile picture
        </p>
        <TextField
          value={firstNameValue}
          onChange={(e) => {
            setFirstNameError(false);
            setFirstNameValue(e.target.value);
          }}
          type="text"
          error={firstNameError}
          className="mt-8"
          required
          fullWidth
          label="First name (required)"
        />
        <TextField
          value={lastNameValue}
          onChange={(e) => setLastNameValue(e.target.value)}
          type="text"
          className="mt-4"
          fullWidth
          label="Last name (optional)"
        />
        {!user.isNewUser && (
          <>
            <TextField
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
              type="text"
              className="mt-4"
              fullWidth
              label="Bio"
              multiline
            />
            <p className="mt-2 text-sm max-w-xs self-start text-textSecondary">
              Any details such as age, occupation or city. Example: 23 y.o.
              designer from San Francisco
            </p>
            <h2 className="self-start font-medium text-textSecondary mt-12">
              Username
            </h2>
            <TextField
              value={usernameValue}
              onChange={handleChange}
              type="text"
              error={usernameError}
              className="mt-8"
              fullWidth
              label={usernameError || usernameStatus || "Username"}
            />
            <p className="mt-2 text-sm self-start text-textSecondary">
              You can choose a username on <b>Chatline</b>. If you do, people
              will be able to find you by this username and contact you without
              needing your phone number.
              <br />
              <br />
              You can use <b>a–z</b>, <b>0–9</b> and underscores. Minimum length
              is 5 characters.
            </p>
            {usernameValue && (
              <p className="mt-4 text-sm self-start text-textSecondary ">
                This link opens a chat with you:
                <br />
                https://chatline-app.vercel.app/{usernameValue}
              </p>
            )}
          </>
        )}
        <LoadingButton
          className={`${
            user.isNewUser
              ? "w-full mt-8"
              : "min-w-[56px] h-14 rounded-full fixed bottom-5 right-5 z-30 tablet:left-[19rem] tablet:right-auto"
          }`}
          variant="contained"
          size={user.isNewUser ? "large" : "medium"}
          loading={loading}
          type="submit"
          disabled={usernameError || usernameStatus === "checking..."}
        >
          {user.isNewUser ? "next" : <DoneIcon />}
        </LoadingButton>
      </form>
    </div>
  );
};

export default Profile;
