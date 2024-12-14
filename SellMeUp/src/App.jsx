import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Landing from './app/Landing'
import CreateBA from './app/CreateBA'
function App() {
  return(
    <>
    <div className=''>
    <Router>
      <Routes >
        <Route path='/' element={<Landing />}/> 
        <Route path='/create' element={<CreateBA />}/>
      </Routes>
    </Router>
    </div>
    </>
  )
}

export default App
