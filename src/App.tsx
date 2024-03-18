import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/home'
import Absensi from './page/absensi';
import Cuti from './page/cuti';

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
        <Route path="/absensi" element={<Absensi />} />
        <Route path="/cuti" element={<Cuti />} />
      </Routes>
    </Router>
  )
}

export default App
