import { JenisCutiModel } from "@/module/model/JenisCutiModel";

export class CutiModel {
    id: string;
    nidn: string|null;
    nip: string|null;
    tanggal: string;
    lama: number;
    jenis: JenisCutiModel;
    tujuan: string;
    dokumen: string|null;
    status: string;
    
    constructor(
        id: string,
        nidn: string|null,
        nip: string|null,
        tanggal: string,
        lama: number,
        jenis: JenisCutiModel,
        tujuan: string,
        dokumen: string|null,
        status: string,
    ) {
        this.nidn = nidn;
        this.nip = nip;
        this.tanggal = tanggal;
        this.lama = lama;
        this.jenis = jenis;
        this.tujuan = tujuan;
        this.dokumen = dokumen;
        this.status = status;
        this.id = id;
    }
  }