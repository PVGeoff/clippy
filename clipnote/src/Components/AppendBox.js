import React, { useState, useEffect } from "react";

function AppendBox() {
  const [textList, setTextList] = useState([]);
  const [] = useState();
  useEffect(() => {}, []);

  window.api.receive("copyText", (data) => {
    let text = data.text
    let reg = /^(#[0-9a-z]{3,8})$/g;
    
    if (reg.test(data.text)) {
      console.log(" I am a color");
      text = text.replace(reg, "$1 <span className")

    }

    let newObj = { content: text, id: Date.now(), isPinned: false };
    let newList = [...textList];
    newList.push(newObj);
    setTextList(newList);
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
      {textList
        .sort((a, b) => b.isPinned - a.isPinned)
        .map((entry) => {
          return (
            <div
              key={entry.id}
              uid={entry.id}
              className="text-box"
              onContextMenu={handleRemove}
              onClick={handleOuter}
            >
              <p>{entry.content}</p>

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
        })}
    </div>
  );
}

export default AppendBox;
