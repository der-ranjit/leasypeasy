import { Observable, Subject } from "rxjs";

export class Controls {
    public static INSTANCE: Controls;

    public static getInstance() {
        if (!Controls.INSTANCE) {
            Controls.INSTANCE = new Controls();
        }
        return Controls.INSTANCE;
    }

    private isKeyDown = false;
    private pressedKeys: string[] = []
    private onKeyDown$ = new Subject<KeyboardEvent>();
    private onKeyUp$ = new Subject<KeyboardEvent>();

    constructor() {
        window.addEventListener("keydown", event => {
            this.addPressedKey(event.key);
            this.isKeyDown = true;
            this.onKeyDown$.next(event);
        });

        window.addEventListener("keyup", event =>  {
            this.removePressedKey(event.key);
            this.isKeyDown = false;
            this.onKeyUp$.next(event);
        });
    }

    public isKeyPressed(keyName: string): boolean {
        return this.isKeyDown && this.pressedKeys.indexOf(keyName) !== -1;
    }

    public onKeyDown(keyName: string): Observable<KeyboardEvent> {
        return new Observable(observer => {
            const subscription = this.onKeyDown$.subscribe(event => {
                if (event.key === keyName) {
                    observer.next(event);
                }
            })
            return () => {
                subscription.unsubscribe();
            }
        })
    }
    
    public onKeyUp(keyName: string): Observable<KeyboardEvent> {
        return new Observable(observer => {
            const subscription = this.onKeyUp$.subscribe(event => {
                if (event.key === keyName) {
                    observer.next(event);
                }
            })
            return () => {
                subscription.unsubscribe();
            }
        })
    }

    private addPressedKey(keyName: string) {
        if (!this.pressedKeys.find(key => key === keyName)) {
            this.pressedKeys.push(keyName);
        }
    }

    private removePressedKey(keyName: string) {
        const idx = this.pressedKeys.indexOf(keyName);
        if (idx !== -1) {
            this.pressedKeys.splice(idx, 1);
        }
    }

}