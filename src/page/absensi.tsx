import { Suspense, lazy } from 'react';
import '../style.css'
const Welcoming = lazy(() => import('../component/Welcoming'));
const Absent = lazy(() => import('../component/Absent'));

function Absensi() {
    return (
        <Suspense fallback={<></>}>
            <div className="wrapper">
                <Welcoming />
                <Absent />
            </div>
        </Suspense>
    );
}

export default Absensi;