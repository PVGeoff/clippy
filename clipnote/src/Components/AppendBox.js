import React, { useState, useEffect } from "react";

function AppendBox() {
  const [textList, setTextList] = useState([]);
  const [id, setId] = useState(0);
  window.api.receive("copyText", (data) => {
    let text = data.text;
    console.log(text);
    let regHex = /^(#?[0-9a-z]{3,8})$/g;
    let regRGB = /.*((rgba|rgb)\(\s*\d+,\s*\d+,\s*\d+(,\s0\.\d{1,3})*\)).*/g;
    let newObj = {
      content: text,
      id: Date.now(),
      isPinned: false,
      colorVal: null,
    };
    if (regHex.test(data.text)) {
      let toSet = data.text.replace(regHex, "$1");
      if (!toSet.startsWith("#")) {
        toSet = "#" + toSet;
      }
      newObj.colorVal = toSet;
    }
    if (regRGB.test(data.text)) {
      console.log("I'm an rgb");
      let toSet = text.replace(regRGB, "$1");
      console.log(toSet);
      newObj.colorVal = toSet;
    }
    let newList = [...textList];
    let isInList = newList.find((e) => data.text.includes(e.content));

    console.log(newList);
    console.log(newObj.content);
    if (!isInList) {
      console.log("I'm not in the list");
      newList.push(newObj);
      setTextList(newList);
    }
  });
  const handleOuter = (e) => {
    const { innerText } = e.target;
    navigator.clipboard.writeText(innerText);
  };
  const handleRemove = (e) => {
    let id = e.currentTarget.getAttribute("uid");
    let newList = [...textList];
    newList = newList.filter((e) => e.id != id);
    setTextList(newList);
  };
  const handlePin = (e, id) => {
    e.stopPropagation();
    let newList = [...textList];
    newList.forEach((e) => {
      if (e.id == id) {
        if (e.isPinned) {
          e.isPinned = false;
        } else {
          e.isPinned = true;
        }
      }
    });
    setTextList(newList);
  };

  return (
    <div className="note-container">
      <div className="sticky">
        {textList.map((entry) => {
          if (entry.isPinned) {
            return (
              <div
                key={entry.id}
                uid={entry.id}
                className="text-box"
                onContextMenu={handleRemove}
                onClick={handleOuter}
              >
                <p>{entry.content}</p>
                <span
                  className="color-preview"
                  style={{ backgroundColor: entry.colorVal }}
                ></span>
                {!entry.isPinned ? (
                  <i
                    onClick={(e) => handlePin(e, entry.id)}
                    className="edit-icon fa fa-thumbtack"
                  />
                ) : (
                  <i
                    onClick={(e) => handlePin(e, entry.id)}
                    className="edit-icon fa fa-close"
                  />
                )}
              </div>
            );
          }
        })}
      </div>
      <div className="not-sticky">
        {textList.map((entry) => {
          if (!entry.isPinned) {
            return (
              <div
                key={entry.id}
                uid={entry.id}
                className="text-box"
                onContextMenu={handleRemove}
                onClick={handleOuter}
              >
                <p>{entry.content}</p>
                <span
                  className="color-preview"
                  style={{ backgroundColor: entry.colorVal }}
                ></span>
                {!entry.isPinned ? (
                  <i
                    onClick={(e) => handlePin(e, entry.id)}
                    className="edit-icon fa fa-thumbtack"
                  />
                ) : (
                  <i
                    onClick={(e) => handlePin(e, entry.id)}
                    className="edit-icon fa fa-close"
                  />
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default AppendBox;
