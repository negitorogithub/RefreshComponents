import { SimpleRefreshContoller } from './../SimpleRefreshContoller'
export {}
test('basic', () => {
    expect(0).toBe(0)
})

class TestSuccess {}

class TestError {}

describe('SimpleRefreshController', () => {
    test('should have value property if successed', async (done) => {
        const rc = new SimpleRefreshContoller<TestSuccess, TestError>({
            refresher: async () => {
                await delay(10)
                return new TestSuccess()
            },
            errorClass: TestError,
        })
        expect(rc.isRefreshing).toEqual<boolean>(false)
        ;async () => {
            await delay(5)
            expect(rc.isRefreshing).toEqual<boolean>(true)
        }
        await rc.requestRefresh()
        expect(rc.refreshState.value).toEqual<TestSuccess>(new TestSuccess())
        expect(rc.refreshState.error).toEqual<undefined>(undefined)
        expect(rc.isRefreshing).toEqual<boolean>(false)

        done()
    })
})

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
