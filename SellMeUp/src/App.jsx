import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Landing from './app/Landing'
import HeaderC from './components/HeaderC'
function App() {
  return(
    <>
    <div className=''>
    <Router>
      <Routes >
        <Route path='/' element={<Landing />}/> 
      </Routes>
    </Router>
    </div>
    </>
  )
}

export default App
