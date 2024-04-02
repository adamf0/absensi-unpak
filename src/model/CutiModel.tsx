import { JenisCuti } from "./JenisCuti";

export class CutiModel {
    tanggal: string;
    lama: number;
    jenis: JenisCuti;
    tujuan: string;
    status: string;
    id: string;
    openDetail: boolean;
    
    constructor(
        tanggal: string,
        lama: number,
        jenis: JenisCuti,
        tujuan: string,
        status: string,
        id: string,
        openDetail: boolean,
    ) {
        this.tanggal = tanggal;
        this.lama = lama;
        this.jenis = jenis;
        this.tujuan = tujuan;
        this.status = status;
        this.id = id;
        this.openDetail = openDetail;    
    }
  }