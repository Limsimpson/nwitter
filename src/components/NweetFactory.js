import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onChange = (e) => {
    const { value } = e.target;
    setNweet(value);
  };

  const onFileChange = async (e) => {
    const { files } = e.target;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { result } = finishedEvent.currentTarget;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    document.getElementById("attach-file").value = "";
    setAttachment("");
  };

  const onSubmit = async (e) => {
    if (nweet === "") {
      return;
    }

    e.preventDefault();

    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    document.getElementById("attach-file").value = "";
    setAttachment("");
  };

  return (
    <form className="factoryForm" onSubmit={onSubmit}>
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
          onChange={onChange}
        />
        <input className="factoryInput__arrow" type="submit" value="&rarr;" />
      </div>
      <label className="factoryInput__label" htmlFor="attach-file">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accep="image/*"
        onChange={onFileChange}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            width="50px"
            height="50px"
            alt="nweet"
            style={{ backgroundImage: attachment }}
          />
          <button className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
