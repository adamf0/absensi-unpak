export class Absen {
    id: string;
    nidn: string|null;
    tanggal: string;
    absen_masuk: string;
    absen_keluar: string|null;
    
    constructor(
        id: string,
        nidn: string|null,
        tanggal: string,
        absen_masuk: string,
        absen_keluar: string|null
    ) {
        this.id = id;
        this.nidn = nidn;
        this.tanggal = tanggal;
        this.absen_masuk = absen_masuk;
        this.absen_keluar = absen_keluar;
    }
  }