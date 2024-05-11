import { AbsenModel } from "@/module/model/AbsenModel";

export class ClaimAbsenModel {
    id: string;
    absen: AbsenModel;
    catatan: string|null;
    absen_masuk: string|null;
    absen_keluar: string|null;
    dokumen: string|null;
    status: string;
    
    constructor(
        id: string,
        absen: AbsenModel,
        catatan: string|null,
        dokumen: string|null,
        absen_masuk: string|null,
        absen_keluar: string|null,
        status: string,
    ) {
        this.absen = absen;
        this.catatan = catatan;
        this.dokumen = dokumen;
        this.absen_masuk = absen_masuk;
        this.absen_keluar = absen_keluar;
        this.status = status;
        this.id = id;
    }
  }