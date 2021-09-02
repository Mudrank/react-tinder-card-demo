import React, { useState, useMemo } from "react";
// import TinderCard from '../react-tinder-card/index'
import TinderCard from "react-tinder-card";
import axios from "axios";

import { getRandomMeme } from "@blad3mak3r/reddit-memes";

let subreddits = ["Cryptomemeshots", "bitcoinmemes", "cryptomemes"];
let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

const db = [
  {
    title: "If you can't hodl, you won't be rich",
    url: "https://preview.redd.it/rz852dq6awi71.jpg?width=640&crop=smart&auto=webp&s=4e77b8bfdedd39a2443e8adf9af2a4ead06fb531",
  },
  {
    title: "When the bullrun is in crypto market and not in the stocks. ",
    url: "https://preview.redd.it/rz852dq6awi71.jpg?width=640&crop=smart&auto=webp&s=4e77b8bfdedd39a2443e8adf9af2a4ead06fb531",
  },
  {
    title: "If you can't hodl, you won't be rich",
    url: "https://preview.redd.it/rz852dq6awi71.jpg?width=640&crop=smart&auto=webp&s=4e77b8bfdedd39a2443e8adf9af2a4ead06fb531",
  },
  {
    title: "If you can't hodl, you won't be rich",
    url: "https://preview.redd.it/rz852dq6awi71.jpg?width=640&crop=smart&auto=webp&s=4e77b8bfdedd39a2443e8adf9af2a4ead06fb531",
  },
  {
    title: "If you can't hodl, you won't be rich",
    url: "https://preview.redd.it/rz852dq6awi71.jpg?width=640&crop=smart&auto=webp&s=4e77b8bfdedd39a2443e8adf9af2a4ead06fb531",
  },
  {
    title: "If you can't hodl, you won't be rich",
    url: "https://preview.redd.it/rz852dq6awi71.jpg?width=640&crop=smart&auto=webp&s=4e77b8bfdedd39a2443e8adf9af2a4ead06fb531",
  },
];

const after = "";
setInterval(() => {
  axios.get(`https://reddit.com/r/${subreddit}.json?after=${after}`)
    .then((response) => response.json())
    .then((body) => {
      after = body.data.after;
      for (let index = 0; index < body.data.children.length; index++) {
        if (body.data.children[index].data.post_hint === "image") {
          db.push({
            title: body.data.children[index].data.title,
            url: body.data.children[index].data.url_overriden_by_dest,
            id : body.data.children[index].data.title
          });
        }
      }
    });
}, 3000);



const alreadyRemoved = [];

let charactersState = db; // This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.

function Advanced() {
 
  const [characters, setCharacters] = useState(db);
  const [lastDirection, setLastDirection] = useState();

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const swiped = (direction, titleToDelete) => {
    console.log("removing: " + titleToDelete);
    setLastDirection(direction);
    alreadyRemoved.push(titleToDelete);
  };

  const outOfFrame = (title) => {
    console.log(title + " left the screen!");
    charactersState = charactersState.filter(
      (character) => character.title !== title
    );
    setCharacters(charactersState);
  };

  const swipe = (dir) => {
    const cardsLeft = characters.filter(
      (person) => !alreadyRemoved.includes(person.title)
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].title; // Find the card object to be removed
      const index = db.map((person) => person.title).indexOf(toBeRemoved); // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };

  return (
    <div>
      <h1>Tinder for cryptomemes</h1>
      <div className="cardContainer">
        {characters.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.title}
            onSwipe={(dir) => swiped(dir, character.title)}
            onCardLeftScreen={() => outOfFrame(character.title)}
          >
            <div
              style={{ backgroundImage: "url(" + character.url + ")" }}
              className="card"
            >
              <h3>{character.title}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button onClick={() => swipe("left")}>Swipe left!</button>
        <button onClick={() => swipe("right")}>Swipe right!</button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} classtitle="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get started!
        </h2>
      )}
    </div>
  );
}

export default Advanced;
