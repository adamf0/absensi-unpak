import { JenisIzinModel } from "./JenisIzinModel";

export class IzinModel {
    id: string;
    tanggal: string;
    jenis: JenisIzinModel;
    tujuan: string;
    dokumen: string|null;
    status: string;
    
    constructor(
        id: string,
        tanggal: string,
        jenis: JenisIzinModel,
        tujuan: string,
        dokumen: string|null,
        status: string,
    ) {
        this.tanggal = tanggal;
        this.jenis = jenis;
        this.tujuan = tujuan;
        this.dokumen = dokumen;
        this.status = status;
        this.id = id;
    }
  }