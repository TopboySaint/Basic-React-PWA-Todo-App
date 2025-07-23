import React from 'react'
import Todo from './pages/Todo'
import {Routes, Route} from 'react-router-dom'

const App = () => {
  return (
    <Routes>
     <Route path='/todo' element={<Todo/>}></Route>
    </Routes>
      
  )
}

export default App