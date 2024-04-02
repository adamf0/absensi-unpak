export class IzinModel {
    tanggal: string;
    tujuan: string;
    status: string;
    id: string;
    openDetail: boolean;
    
    constructor(
        tanggal: string,
        tujuan: string,
        status: string,
        id: string,
        openDetail: boolean,
    ) {
        this.tanggal = tanggal;
        this.tujuan = tujuan;
        this.status = status;
        this.id = id;
        this.openDetail = openDetail;    
    }
  }