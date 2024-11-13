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

<<<<<<< HEAD
export default EmojiPickerComp;
=======
export default EmojiPickerComp;
>>>>>>> 851b8c25d5ab8a7843e61d640828d6eb951ee41d
