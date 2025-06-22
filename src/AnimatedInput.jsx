import React, { useRef, useState, useLayoutEffect } from "react";
import "./AnimatedInput.scss";

export default function AnimatedInput({ variant = "center" }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const mirrorRef = useRef(null);
  const [cursorLeft, setCursorLeft] = useState(0);
  const isCenter = variant === "center";

  // Update cursor position when text changes
  const handleChange = e => {
    setValue(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Focus input when wrapper is clicked
  const handleWrapperClick = () => {
    inputRef.current.focus();
  };

  // Update cursor position on selection change
  const handleSelect = e => {
    setCursorPosition(e.target.selectionStart);
  };

  // Update cursorLeft based on mirror span
  useLayoutEffect(() => {
    if (mirrorRef.current) {
      setCursorLeft(mirrorRef.current.offsetWidth);
    }
  }, [value, cursorPosition]);

  // Get the text up to the cursor
  const beforeCursor = value.slice(0, cursorPosition);

  // Calculate paddings and scroll for accurate cursor clamping
  let inputLeftPadding = 0;
  let inputRightPadding = 0;
  let inputScrollLeft = 0;
  let inputWidth = 0;
  if (inputRef.current) {
    const style = window.getComputedStyle(inputRef.current);
    inputLeftPadding = parseInt(style.paddingLeft, 10) || 0;
    inputRightPadding = parseInt(style.paddingRight, 10) || 0;
    inputScrollLeft = inputRef.current.scrollLeft;
    inputWidth = inputRef.current.offsetWidth;
  }

  // Center offset logic for center variant
  let centerOffset = 0;
  if (isCenter && inputWidth > 0 && cursorLeft + inputLeftPadding + inputRightPadding < inputWidth) {
    centerOffset = (inputWidth - (inputLeftPadding + inputRightPadding + mirrorRef.current?.offsetWidth || 0)) / 2;
  }

  // Clamp cursor: left padding + measured width - scrollLeft + centerOffset, but not past the right edge
  const unclampedCursorLeft = inputLeftPadding + cursorLeft - inputScrollLeft + centerOffset;
  const maxCursorLeft = inputWidth - inputRightPadding - 2; // 2px for cursor width
  const clampedCursorLeft = Math.max(inputLeftPadding, Math.min(unclampedCursorLeft, maxCursorLeft));

  return (
    <div className={`animated-input-wrapper${isCenter ? " center" : " start"}`} onClick={handleWrapperClick}>
      <input
        ref={inputRef}
        className={`animated-input${isCenter ? " center" : " start"}`}
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        spellCheck={false}
        autoComplete="off"
      />
      {/* Hidden mirror span for measuring cursor position */}
      <span
        className={`input-mirror-span${isCenter ? " center" : " start"}`}
        ref={mirrorRef}
        aria-hidden
        style={isCenter ? { left: centerOffset } : { left: 0 }}
      >
        {beforeCursor}
      </span>
      {/* Show blinking cursor only when input is focused */}
      {isFocused && (
        <span
          className="custom-cursor"
          data-cursor-left={clampedCursorLeft}
        />
      )}
    </div>
  );
}
