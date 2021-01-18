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
