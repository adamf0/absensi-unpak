import { Observer } from "@/module/abstract/Observer";

export class AlertObserver implements Observer {
    update(param:any) {
        alert(param);
    }
}