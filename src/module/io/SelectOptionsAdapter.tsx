import { TSelectOption } from "../../components/form/SelectReact";
import { JenisCuti } from "../model/JenisCuti";

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
}