import { Observer } from "@/module/abstract/Observer";

export class HandlerObserver {
    private observers: Observer[] = [];

    // Menambahkan observer ke subjek
    addObserver(observer: Observer) {
        this.observers.push(observer);
    }

    // Menghapus observer dari subjek
    removeObserver(observer: Observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    // Memberi tahu semua observer saat subjek mengalami perubahan
    notifyObservers(param:any) {
        for (const observer of this.observers) {
            observer.update(param);
        }
    }
}