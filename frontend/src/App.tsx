import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const authUser = false;

  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Routes>
        <Route
          path='/'
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path='/login'
          element={authUser ? <Navigate to='/' /> : <LoginPage />}
        />
        <Route
          path='/signup'
          element={authUser ? <Navigate to='/' /> : <SignupPage />}
        />
        {/* catch all routes */}
        <Route
          path='*'
          element={<Navigate to='/' replace />}
        />
      </Routes>
    </div >
  )
}

export default App
