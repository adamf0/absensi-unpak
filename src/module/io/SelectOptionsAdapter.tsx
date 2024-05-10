import { TSelectOption } from "@/module/../components/form/SelectReact";
import { JenisCutiModel } from "@/module/model/JenisCutiModel";
import { JenisIzinModel } from "@/module/model/JenisIzinModel";

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
}