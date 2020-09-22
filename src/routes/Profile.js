import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { authService } from "fbase";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (e) => {
    const { value } = e.target;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  // const getMyNweets = async () => {
  //   const nweets = await dbService
  //     .collection("nweets")
  //     .where("creatorId", "==", userObj.uid)
  //     .orderBy("createAt")
  //     .get();
  //   nweets = await nweets.docs.map((doc) => doc.data());
  // };

  // useEffect(() => {
  //   getMyNweets();
  // }, []);

  return (
    <div className="container">
      <form className="profileForm" onSubmit={onSubmit}>
        <input
          className="formInput"
          type="text"
          placeholder="Display Name"
          vluae={newDisplayName}
          autoFocus
          onChange={onChange}
        />
        <input className="formBtn" type="submit" value="Update Profile" />
      </form>
      <button className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log out
      </button>
    </div>
  );
};
export default Profile;
