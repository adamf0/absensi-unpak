interface JenisCuti {
    [key: string]: string;
}

const jenis_cuti:JenisCuti = {
    "1": "tes",
    "default": "-"
};

export const GetJenisCuti = (kode_jenis_cuti: string) => {
    return (
        jenis_cuti.hasOwnProperty(kode_jenis_cuti) ? jenis_cuti[kode_jenis_cuti] : jenis_cuti["default"]
    );
};
