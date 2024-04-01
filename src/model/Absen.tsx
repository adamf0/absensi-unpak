export class Absen {
    id: string;
    nidn: number;
    tanggal: string;
    absen_masuk: string;
    absen_keluar: string;
    
    constructor(
        id: string,
        nidn: number,
        tanggal: string,
        absen_masuk: string,
        absen_keluar: string
    ) {
        this.id = id;
        this.nidn = nidn;
        this.tanggal = tanggal;
        this.absen_masuk = absen_masuk;
        this.absen_keluar = absen_keluar;
    }
  }