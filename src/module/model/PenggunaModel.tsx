export class PenggunaModel {
    id: string;
    username: string;
    password: string;
    nama: string;
    level: string;
    nidn: string|null;
    
    constructor(
        id: string,
        username: string,
        password: string,
        nama: string,
        level: string,
        nidn: string|null,
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.nama = nama;
        this.level = level;
        this.nidn = nidn;
    }
  }