import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Landing from './app/Landing'
import CreateBA from './app/CreateBA'
import CreateUser from './app/CreateUser'

function App() {
  return(
    <>
    <div className=''>
    <Router>
      <Routes >
        <Route path='/' element={<Landing />}/> 
        <Route path='/create' element={<CreateBA />}/>
        <Route path="/create-user" element={<CreateUser />} />
      </Routes>
    </Router>
    </div>
    </>
  )
}

export default App
