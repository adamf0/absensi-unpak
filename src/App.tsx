import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/home'

function App() {
  {/*<Routes>
          <Route element={<UnAuthenticateRoutes />}>
            <Route path="/" element={<BeforeLoginLayout />}>
              <Route index element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>
          <Route element={<AuthenticateRoutes />}>
            <Route path="/admin" element={<AfterLoginLayout />} >
              <Route index element={<LandingPage />} />
              <Route path="test" element={<LandingPage />} />
            </Route>
          </Route>
    </Routes>  */}
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
