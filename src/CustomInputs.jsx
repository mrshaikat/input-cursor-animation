import { useState, useRef, useEffect } from "react"
import "./CustomInputs.scss"

const CustomInputs = () => {
  const [centerValue, setCenterValue] = useState("")
  const [leftValue, setLeftValue] = useState("")
  const [centerFocused, setCenterFocused] = useState(false)
  const [leftFocused, setLeftFocused] = useState(false)
  const [centerCursorPos, setCenterCursorPos] = useState(0)
  const [leftCursorPos, setLeftCursorPos] = useState(0)

  const centerInputRef = useRef(null)
  const leftInputRef = useRef(null)

  const updateCursorPosition = (
    inputRef,
    setValue,
    isCenter,
  ) => {
    if (inputRef.current) {
      const input = inputRef.current
      const selectionStart = input.selectionStart || 0
      const fullText = input.value
      const textBeforeCursor = fullText.substring(0, selectionStart)

      // Create a temporary span to measure text width
      const span = document.createElement("span")
      const computedStyle = window.getComputedStyle(input)
      span.style.font = computedStyle.font
      span.style.fontSize = computedStyle.fontSize
      span.style.fontFamily = computedStyle.fontFamily
      span.style.fontWeight = computedStyle.fontWeight
      span.style.letterSpacing = computedStyle.letterSpacing
      span.style.visibility = "hidden"
      span.style.position = "absolute"
      span.style.whiteSpace = "pre"
      document.body.appendChild(span)

      if (isCenter) {
        // For center input, calculate position relative to center
        const inputWidth = input.offsetWidth
        const padding = 24 // 24px on each side
        const centerPoint = inputWidth / 2

        // Measure full text width to find the starting position of centered text
        span.textContent = fullText
        const fullTextWidth = span.offsetWidth

        // Measure text before cursor
        span.textContent = textBeforeCursor
        const textBeforeCursorWidth = span.offsetWidth

        // Calculate where the text starts (left edge of centered text)
        const textStartX = centerPoint - fullTextWidth / 2

        // Cursor position is text start + width of text before cursor
        const cursorX = textStartX + textBeforeCursorWidth

        // Ensure cursor stays within input bounds
        const minX = padding
        const maxX = inputWidth - padding
        setValue(Math.max(minX, Math.min(maxX, cursorX)))
      } else {
        // For left input, start from left padding
        span.textContent = textBeforeCursor
        const textWidth = span.offsetWidth
        setValue(24 + textWidth) // 24px is the left padding
      }

      document.body.removeChild(span)
    }
  }

  useEffect(() => {
    if (centerFocused) {
      updateCursorPosition(centerInputRef, setCenterCursorPos, true)
    }
  }, [centerValue, centerFocused])

  useEffect(() => {
    if (leftFocused) {
      updateCursorPosition(leftInputRef, setLeftCursorPos, false)
    }
  }, [leftValue, leftFocused])

  // Helper to generate a class for the cursor position
  function getCursorClass(pos) {
    return `cursor-pos-${Math.round(pos)}`;
  }

  return (
    <div className="custom-inputs-container">
      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="main-title">Custom Input Variants</h1>
          <p className="subtitle">Two different input styles with custom cursor animations</p>
        </div>

        {/* Center-aligned Input */}
        <div className="input-section">
          <h2 className="section-title">Center-aligned Input</h2>
          <div className={`input-wrapper ${getCursorClass(centerCursorPos)}`}>
            <input
              ref={centerInputRef}
              type="text"
              value={centerValue}
              onChange={(e) => setCenterValue(e.target.value)}
              onFocus={() => setCenterFocused(true)}
              onBlur={() => setCenterFocused(false)}
              onKeyUp={() => updateCursorPosition(centerInputRef, setCenterCursorPos, true)}
              onKeyDown={() => setTimeout(() => updateCursorPosition(centerInputRef, setCenterCursorPos, true), 0)}
              onClick={() => setTimeout(() => updateCursorPosition(centerInputRef, setCenterCursorPos, true), 0)}
              onSelect={() => updateCursorPosition(centerInputRef, setCenterCursorPos, true)}
              onInput={() => updateCursorPosition(centerInputRef, setCenterCursorPos, true)}
              placeholder="Type from center..."
              className="input-field input-field--center"
            />
            {centerFocused && (
              <div
                className="custom-cursor"
                data-cursor-left={centerCursorPos}
              />
            )}
          </div>
        </div>

        {/* Left-aligned Input */}
        <div className="input-section">
          <h2 className="section-title">Left-aligned Input</h2>
          <div className={`input-wrapper ${getCursorClass(leftCursorPos)}`}>
            <input
              ref={leftInputRef}
              type="text"
              value={leftValue}
              onChange={(e) => setLeftValue(e.target.value)}
              onFocus={() => setLeftFocused(true)}
              onBlur={() => setLeftFocused(false)}
              onKeyUp={() => updateCursorPosition(leftInputRef, setLeftCursorPos, false)}
              onClick={() => updateCursorPosition(leftInputRef, setLeftCursorPos, false)}
              placeholder="Type from left..."
              className="input-field input-field--left"
            />
            {leftFocused && (
              <div
                className="custom-cursor"
                data-cursor-left={leftCursorPos}
              />
            )}
          </div>
        </div>

        {/* Demo Text */}
        <div className="demo-section">
          <h3 className="demo-title">Current Values:</h3>
          <div className="demo-content">
            <p className="demo-item">
              <span className="demo-label">Center Input:</span> {centerValue || "Empty"}
            </p>
            <p className="demo-item">
              <span className="demo-label">Left Input:</span> {leftValue || "Empty"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomInputs
