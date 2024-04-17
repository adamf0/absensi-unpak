import { JenisIzin } from "./JenisIzin";

export class IzinModel {
    tanggal: string;
    jenis: JenisIzin;
    tujuan: string;
    dokumen: string|null;
    status: string;
    id: string;
    openDetail: boolean;
    
    constructor(
        tanggal: string,
        jenis: JenisIzin,
        tujuan: string,
        dokumen: string|null,
        status: string,
        id: string,
        openDetail: boolean,
    ) {
        this.tanggal = tanggal;
        this.jenis = jenis;
        this.tujuan = tujuan;
        this.dokumen = dokumen;
        this.status = status;
        this.id = id;
        this.openDetail = openDetail;    
    }
  }