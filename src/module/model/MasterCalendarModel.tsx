export class MasterCalendarModel {
    id: string;
    tanggal_mulai: string;
    tanggal_akhir: any;
    keterangan: string;
    
    constructor(
        id: string,
        tanggal_mulai: string,
        tanggal_akhir: any,
        keterangan: string,
    ) {
        this.id = id;
        this.tanggal_mulai = tanggal_mulai;
        this.tanggal_akhir = tanggal_akhir;
        this.keterangan = keterangan;
    }
  }