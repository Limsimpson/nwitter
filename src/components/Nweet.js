import React from "react";
import { dbService } from "fbase";

const Nweet = ({ nweet, isOwner }) => {
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweet.id}`).delete();
    }
  };

  return (
    <div>
      <h4>{nweet.text}</h4>
      {isOwner && (
        <>
          <button onClick={onDeleteClick}>Delete Nweet</button>
          <button>Edit Nweet</button>
        </>
      )}
    </div>
  );
};

export default Nweet;
