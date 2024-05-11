import { Observer } from "@/module/abstract/Observer";

export class ConsoleObserver implements Observer {
    update(param:any) {
        console.trace(param);
    }
}