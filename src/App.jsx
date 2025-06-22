import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AnimatedInput from "./AnimatedInput";
import CustomInputs from './CustomInputs';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <div className="card">

        {/* <div style={{ marginTop: 24 }}>
          <AnimatedInput variant='center'/>
        </div>
         <div style={{ marginTop: 24 }}>
          <AnimatedInput variant='left'/>
        </div> */}
          <div style={{ marginTop: 24 }}>
          <CustomInputs/>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
