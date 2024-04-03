import { Observer } from "../abstract/Observer";

export class AlertObserver implements Observer {
    update(param:any) {
        alert(param);
    }
}