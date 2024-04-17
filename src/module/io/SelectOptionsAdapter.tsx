import { TSelectOption } from "../../components/form/SelectReact";
import { JenisCuti } from "../model/JenisCuti";
import { JenisIzin } from "../model/JenisIzin";

export class SelectOptionsAdapter {
    static adaptFromJenisCuti(list: JenisCuti[]): TSelectOption[] {
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
    static adaptFromJenisIzin(list: JenisIzin[]): TSelectOption[] {
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
}