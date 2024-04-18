export class JenisCutiModel {
    id: string;
    nama: string;
    min: string;
    max: string;
    dokumen: boolean;
    kondisi: any;
    
    constructor(
        id: string,
        nama: string,
        min: string,
        max: string,
        dokumen: boolean,
        kondisi: any,
    ) {
        this.id = id;
        this.nama = nama;
        this.min = min;
        this.max = max;
        this.dokumen = dokumen;
        this.kondisi = kondisi;
    }
  }