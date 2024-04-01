import { Suspense } from 'react';
import '../style.css'
import Welcoming from '../component/Welcoming';
import Absent from '../component/Absent';

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