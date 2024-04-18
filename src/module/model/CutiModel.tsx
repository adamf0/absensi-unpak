import { JenisCutiModel } from "./JenisCutiModel";

export class CutiModel {
    id: string;
    tanggal: string;
    lama: number;
    jenis: JenisCutiModel;
    tujuan: string;
    dokumen: string|null;
    status: string;
    
    constructor(
        id: string,
        tanggal: string,
        lama: number,
        jenis: JenisCutiModel,
        tujuan: string,
        dokumen: string|null,
        status: string,
    ) {
        this.tanggal = tanggal;
        this.lama = lama;
        this.jenis = jenis;
        this.tujuan = tujuan;
        this.dokumen = dokumen;
        this.status = status;
        this.id = id;
    }
  }