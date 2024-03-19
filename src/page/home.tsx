import { Suspense, lazy } from 'react';
import '../home.css'
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