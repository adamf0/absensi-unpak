import { JenisIzinModel } from "@/module/model/JenisIzinModel";

export class IzinModel {
    id: string;
    nidn: string|null;
    nip: string|null;
    tanggal: string;
    jenis: JenisIzinModel;
    tujuan: string;
    dokumen: string|null;
    status: string;
    
    constructor(
        id: string,
        nidn: string|null,
        nip: string|null,
        tanggal: string,
        jenis: JenisIzinModel,
        tujuan: string,
        dokumen: string|null,
        status: string,
    ) {
        this.nidn = nidn;
        this.nip = nip;
        this.tanggal = tanggal;
        this.jenis = jenis;
        this.tujuan = tujuan;
        this.dokumen = dokumen;
        this.status = status;
        this.id = id;
    }
  }