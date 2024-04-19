type TPeriodKEY = 'HARI' | 'MINGGU' | 'BULAN' | 'Semua';
type TPeriodText = 'Hari' | 'Minggu' | 'Bulan' | 'Semua';

export type TPeriod = {
	text: TPeriodText;
};
export type TPeriods = {
	[key in TPeriodKEY]: TPeriod;
};

const Periode: TPeriods = {
	HARI: { text: 'Hari' },
	MINGGU: { text: 'Minggu' },
	BULAN: { text: 'Bulan' },
    Semua: { text: 'Semua' },
};

export default Periode;
