import { Suspense, lazy } from 'react';
import '../style.css'
const Welcoming = lazy(() => import('../component/Welcoming'));
const Absent = lazy(() => import('../component/Absent'));

function Home() {
    return (
        <Suspense fallback={<></>}>
            <div className="wrapper">
                <Welcoming />
                <Absent />
            </div>
        </Suspense>
    );
}

export default Home;