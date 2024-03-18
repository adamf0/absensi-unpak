import { Suspense, lazy } from 'react';
import '../home.css'
const Welcoming = lazy(() => import('../component/welcoming'));
const Absent = lazy(() => import('../component/absent'));

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