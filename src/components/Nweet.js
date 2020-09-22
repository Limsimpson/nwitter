import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweet, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweet.text);

  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setNewNweet(nweet.text);
  };

  const onChange = (e) => {
    const { value } = e.target;
    setNewNweet(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`nweets/${nweet.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweet.id}`).delete();
      await storageService.refFromURL(nweet.attachmentUrl).delete();
    }
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form className="container nweetEdit" onSubmit={onSubmit}>
                <input
                  className="formInput nweet-input"
                  type="text"
                  placeholder="Edit your nweet."
                  value={newNweet}
                  required
                  autoFocus
                  onChange={onChange}
                />
                <input className="formBtn" type="submit" value="Update Nweet" />
              </form>
              <button className="formBtn cancelBtn" onClick={toggleEditing}>
                Cancel
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweet.text}</h4>
          {nweet.attachmentUrl && <img src={nweet.attachmentUrl} alt="nweet" />}
          {isOwner && (
            <div className="nweet__actions">
              <button onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
