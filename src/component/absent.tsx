import '../home.css'

function Absent() {
    return (
        <section className="absent card">
            <div className="absent__content row-container spaceBetweenRow">
                <h3>Absensi</h3>
                <button className="btn btnSmall blueDark">Absen</button>
            </div>
            <div className="absent__content row-container spaceAroundRow">
                <div className="calendar">
                    <div className="calendar-header row-container spaceAroundRow">
                        <a href="#" className="">back</a>
                        <span className="">Desember</span>
                        <a href="#" className="">next</a>
                    </div>
                    <div className="calendar-sub-header grid">
                        <span>min</span>
                        <span>sen</span>
                        <span>sel</span>
                        <span>rab</span>
                        <span>kam</span>
                        <span>jum</span>
                        <span>sab</span>
                    </div>
                    <ol className="calendar-content grid">
                        <li className='disabled'>1</li>
                        <li className='active'>2</li>
                        <li className='active'>3</li>
                        <li className='active'>4</li>
                        <li className='active'>5</li>
                        <li className='active'>6</li>
                        <li className='active'>7</li>

                        <li className='active cuti'>8</li>
                        <li className='active masuk'>9</li>
                        <li className='active tidak_masuk'>10</li>
                        <li className='active'>11</li>
                        <li className='now'>12</li>
                        <li className='active'>13</li>
                        <li className='active'>14</li>

                        <li className='active'>15</li>
                        <li className='active'>16</li>
                        <li className='active'>17</li>
                        <li className='active'>18</li>
                        <li className='active'>19</li>
                        <li className='active'>20</li>
                        <li className='active'>21</li>

                        <li className='active'>22</li>
                        <li className='active'>23</li>
                        <li className='active'>24</li>
                        <li className='active'>25</li>
                        <li className='active'>26</li>
                        <li className='active'>27</li>
                        <li className='active'>28</li>

                        <li className='active'>29</li>
                        <li className='active'>30</li>
                        <li className='active'>31</li>
                    </ol>
                </div>
                <div className="calendar-event">
                    <div className="event-item">
                        <label className="event-status cuti">Cuti sakit</label>
                        <p className="event-tujuan">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque, illum!</p>
                    </div>
                    <div className="event-item notFound">
                        Tidak ada cuti
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Absent;