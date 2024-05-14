import { JenisSPPDModel } from "@/module/model/JenisSPPDModel";

export class SPPDModel {
    id: string;
    nidn: string|null;
    nip: string|null;
    tujuan: string;
    jenis_sppd: JenisSPPDModel;
    tanggal_berangkat: string;
    tanggal_kembali: string;
    keterangan: string;
    
    constructor(
        id: string,
        nidn: string|null,
        nip: string|null,
        tujuan: string,
        jenis_sppd: JenisSPPDModel,
        tanggal_berangkat: string,
        tanggal_kembali: string,
        keterangan: string
    ) {
        this.id = id;
        this.nidn = nidn;
        this.nip = nip;
        this.tujuan = tujuan;
        this.jenis_sppd = jenis_sppd;
        this.tanggal_berangkat = tanggal_berangkat;
        this.tanggal_kembali = tanggal_kembali;
        this.keterangan = keterangan;
    }
  }