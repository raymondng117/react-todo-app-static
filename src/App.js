import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './Components/LoginPage/LogIn';
import ToDoPage from './Components/ToDoPage/ToDoPage';
import SignUpPage from './Components/SignUpPage/SignUp';
import { Route, Routes } from 'react-router-dom';


function App() {
    
  const apiURL = process.env.REACT_APP_NGROK_API;

  return (

      <div className="App">
          <Routes>
            <Route path='/' element={<LoginPage  apiURL={apiURL} />}>
            </Route>
            <Route path='/signup' element={<SignUpPage  apiURL={apiURL} />}>
            </Route>
            <Route path='/todopage' element={<ToDoPage apiURL={apiURL}/>}>
            </Route>
          </Routes>
      </div>

  );
}

export default App;