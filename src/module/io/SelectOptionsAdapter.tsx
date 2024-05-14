import { TSelectOption } from "@/components/form/SelectReact";
import { JenisCutiModel } from "@/module/model/JenisCutiModel";
import { JenisIzinModel } from "@/module/model/JenisIzinModel";
import { AbsenModel } from "../model/AbsenModel";
import moment from "moment";
import { JenisSPPDModel } from "../model/JenisSPPDModel";

export class SelectOptionsAdapter {
    static adaptFromJenisCuti(list: JenisCutiModel[]): TSelectOption[] {
        if (!list || list.length === 0) return [];

        return list.reduce((acc: TSelectOption[], jenisCuti) => {
            acc.push({
                value: jenisCuti.id,
                label: jenisCuti.nama,
                isFixed: true,
                isDisabled: false
            });
            return acc;
        }, []);
    }
    static adaptFromJenisIzin(list: JenisIzinModel[]): TSelectOption[] {
        if (!list || list.length === 0) return [];

        return list.reduce((acc: TSelectOption[], jenisIzin) => {
            acc.push({
                value: jenisIzin.id,
                label: jenisIzin.nama,
                isFixed: true,
                isDisabled: false
            });
            return acc;
        }, []);
    }
    static adaptFromJenisSPPD(list: JenisSPPDModel[]): TSelectOption[] {
        if (!list || list.length === 0) return [];

        return list.reduce((acc: TSelectOption[], jenisSPPD) => {
            acc.push({
                value: jenisSPPD.id,
                label: jenisSPPD.nama,
                isFixed: true,
                isDisabled: false
            });
            return acc;
        }, []);
    }
    static adaptFromAbsen(list: AbsenModel[]): TSelectOption[] {
        if (!list || list.length === 0) return [];

        return list.reduce((acc: TSelectOption[], absen) => {
            acc.push({
                value: absen.id,
                label: `${moment(absen.tanggal).locale('id-ID').format("dddd, DD MMMM YYYY")} (${moment(absen.absen_masuk ?? "").locale('id-ID').format("HH:mm:ss")} - ${moment(absen.absen_keluar ?? "").locale('id-ID').format("HH:mm:ss")})`,
                isFixed: true,
                isDisabled: false
            });
            return acc;
        }, []);
    }
}