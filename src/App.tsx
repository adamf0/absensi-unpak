import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/home'
import Absensi from './page/absensi';
import Cuti from './page/cuti';
import Login from './page/login';
import AuthenticateRoutes from './component/AuthenticateRoutes';
import BlockAfterAuthenticateRoutes from './component/BlockAfterAuthenticateRoutes';
import Logout from './page/logout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/absensi" element={
          <AuthenticateRoutes>
              <Absensi />
          </AuthenticateRoutes>
        } />
        <Route path="/cuti" element={
          <AuthenticateRoutes>
            <Cuti />
          </AuthenticateRoutes>
        } />
        <Route path="/login" element={
          <BlockAfterAuthenticateRoutes>
            <Login />
          </BlockAfterAuthenticateRoutes>} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  )
}

export default App
