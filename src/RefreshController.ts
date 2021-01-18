export class RefreshState<V, E> {
    value: V | undefined
    error: E | undefined
}

export abstract class RefreshController<V, E> {
    readonly refresher: (() => Promise<V>) | undefined
    readonly errorClass: new (...args: any[]) => E
    readonly refreshState = new RefreshState<V, E>()
    private _isRefreshing = false

    constructor(
        refresher: () => Promise<V>,
        errorClass: { new (...args: any[]): E }
    ) {
        this.refresher = refresher
        this.errorClass = errorClass
    }

    async requestRefresh(): Promise<void> {
        if (this.refresher == undefined) {
            return
        }
        const isE = (obj: any) => {
            return obj instanceof this.errorClass
        }
        try {
            this._isRefreshing = true
            const result = await this.refresher()
            this.refreshState.value = result
        } catch (error) {
            if (isE(error)) {
                this.refreshState.error = error
            }
        }
        this._isRefreshing = false
    }

    get isRefreshing() {
        return this._isRefreshing
    }
}
