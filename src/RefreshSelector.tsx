import { useEffect, useState } from 'react'
import { startWith } from 'rxjs/operators'
import { RefreshController } from './RefreshController'
import { RefreshState } from './RefreshState'
export const RefreshSelector = <V extends {}, E extends {}>(props: {
    onValue: JSX.Element
    onError: JSX.Element
    onLoading: JSX.Element
    refreshController: () => RefreshController<V, E>
}): JSX.Element => {
    let ret: JSX.Element
    const [state, setState] = useState(
        new RefreshState<TestSuccess, TestError>()
    )
    useEffect(() => {
        props
            .refreshController()
            .onStateSetSubject.pipe(
                startWith(props.refreshController().getRefreshState())
            )
            .subscribe((_state) => {
                setState(_state)
                console.log(_state)
            })
    }, [])

    if (state.isSuccess) {
        ret = props.onValue
    } else if (state.isRefreshing) {
        ret = props.onLoading
    } else if (state.hasError) {
        ret = props.onError
    } else {
        ret = props.onError
    }
    return ret
}

class TestSuccess {}

class TestError {}
