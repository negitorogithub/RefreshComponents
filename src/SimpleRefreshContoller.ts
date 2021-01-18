import { RefreshController } from './RefreshController'

export class SimpleRefreshContoller<V, E> extends RefreshController<V, E> {
    constructor(props: {
        readonly refresher: () => Promise<V>
        readonly errorClass: { new (...args: any[]): E }
    }) {
        super(props.refresher, props.errorClass)
    }
}
