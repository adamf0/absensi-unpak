export class AbsenModel {
    id: string;
    nidn: string|null;
    nip: string|null;
    tanggal: string;
    absen_masuk: string;
    absen_keluar: string|null;
    otomatis_keluar: number;
    
    constructor(
        id: string,
        nidn: string|null,
        nip: string|null,
        tanggal: string,
        absen_masuk: string,
        absen_keluar: string|null,
        otomatis_keluar: number
    ) {
        this.id = id;
        this.nidn = nidn;
        this.nip = nip;
        this.tanggal = tanggal;
        this.absen_masuk = absen_masuk;
        this.absen_keluar = absen_keluar;
        this.otomatis_keluar = otomatis_keluar;
    }
  }