import React from 'react'
import { RefreshSelector } from './RefreshSelector'
import { SimpleRefreshContoller } from './SimpleRefreshContoller'
export const App = () => {
    return (
        <RefreshSelector<number, TestError>
            onValue={<div>Success</div>}
            onError={<div>Error</div>}
            onLoading={<div>Loading</div>}
            refreshController={() => {
                const rc = new SimpleRefreshContoller({
                    refresher: async () => {
                        await delay(5220)
                        return 2
                    },
                    errorClass: TestError,
                })
                rc.requestRefresh()
                return rc
            }}
        ></RefreshSelector>
    )
}

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

class TestError {}
