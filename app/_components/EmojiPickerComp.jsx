import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";

function EmojiPickerComp({ children, setEmojiIcon }) {
  const [openEmoji, setOpenEmoji] = useState(false);

  return (
    <div onClick={() => setOpenEmoji(!openEmoji)}>
      <div>{children}</div>
      {openEmoji && (
        <div className="absolute z-10 mt-2">
          <EmojiPicker
            emojiStyle="facebook"
            onEmojiClick={(e) => {
              setEmojiIcon(e.emoji);
              setOpenEmoji(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiPickerComp;
