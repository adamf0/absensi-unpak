import { Suspense } from 'react';
import '../style.css'
import WelcomingComponent from '../component/WelcomingComponent';
import AbsentComponent from '../component/AbsentComponent';

function HomePage() {
    return (
        <Suspense fallback={<></>}>
            <div className="wrapper">
                <WelcomingComponent />
                <AbsentComponent />
            </div>
        </Suspense>
    );
}

export default HomePage;