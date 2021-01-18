import { Subject } from 'rxjs'

export class RefreshState<V, E> {
    readonly value: V | undefined
    readonly error: E | undefined
    readonly isRefreshing: boolean

    get isSuccess() {
        return this.value != undefined
    }

    get hasError() {
        return this.error != undefined
    }

    constructor({
        value,
        error,
        isRefreshing,
    }: {
        value?: V
        error?: E
        isRefreshing?: boolean
    } = {}) {
        this.value = value ?? undefined
        this.error = error ?? undefined
        this.isRefreshing = isRefreshing ?? false
    }

    copyWith({
        value,
        error,
        isRefreshing,
    }: {
        value?: V
        error?: E
        isRefreshing?: boolean
    }) {
        return new RefreshState<V, E>({
            value: value ?? this.value,
            error: error ?? this.error,
            isRefreshing: isRefreshing ?? this.isRefreshing,
        })
    }
}

export abstract class RefreshController<V, E> {
    readonly refresher: (() => Promise<V>) | undefined
    readonly errorClass: new (...args: any[]) => E
    readonly onStateSetSubject = new Subject<RefreshState<V, E>>()
    readonly isRefreshingSubject = new Subject<boolean>()
    private _refreshState = new RefreshState<V, E>()

    constructor(
        refresher: () => Promise<V>,
        errorClass: { new (...args: any[]): E }
    ) {
        this.refresher = refresher
        this.errorClass = errorClass
    }

    private set refreshState(value: RefreshState<V, E>) {
        this._refreshState = value
        this.onStateSetSubject.next(value)
    }

    private get refreshState(): RefreshState<V, E> {
        return this._refreshState
    }

    public get value(): V | undefined {
        return this.refreshState.value
    }

    public get error(): E | undefined {
        return this.refreshState.error
    }

    async requestRefresh(): Promise<void> {
        if (this.refresher == undefined) {
            return
        }
        const isE = (obj: any) => {
            return obj instanceof this.errorClass
        }
        try {
            this.refreshState = this.refreshState.copyWith({
                isRefreshing: true,
            })
            const result = await this.refresher()
            this.refreshState = this.refreshState.copyWith({
                value: result,
            })
        } catch (error) {
            if (isE(error)) {
                this.refreshState = this.refreshState.copyWith({ error: error })
            }
        }
        this.refreshState = this.refreshState.copyWith({ isRefreshing: false })
    }

    get isRefreshing() {
        return this.refreshState.isRefreshing
    }
}
