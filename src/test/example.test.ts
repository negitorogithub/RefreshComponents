import { SimpleRefreshContoller } from './../SimpleRefreshContoller'
import { RefreshController } from '../RefreshController'
test('basic', () => {
    expect(0).toBe(0)
})

class TestSuccess {}

class TestError {}

describe('SimpleRefreshController', () => {
    let rcSuccess: RefreshController<TestSuccess, TestError>
    let rcError: RefreshController<TestSuccess, TestError>
    beforeEach(() => {
        rcSuccess = new SimpleRefreshContoller<TestSuccess, TestError>({
            refresher: async () => {
                await delay(10)
                return new TestSuccess()
            },
            errorClass: TestError,
        })
        rcError = new SimpleRefreshContoller<TestSuccess, TestError>({
            refresher: async () => {
                await delay(10)
                throw new TestError()
            },
            errorClass: TestError,
        })
    })

    test('should have value property if successed', async (done) => {
        await rcSuccess.requestRefresh()
        expect(rcSuccess.value).toEqual<TestSuccess>(new TestSuccess())
        expect(rcSuccess.error).toEqual<undefined>(undefined)
        done()
    })
    test('should have error property if failed', async (done) => {
        await rcError.requestRefresh()
        expect(rcError.value).toEqual<undefined>(undefined)
        expect(rcError.error).toEqual<TestError>(new TestError())
        done()
    })
    test('should change isRefreshing property appropriately', async (done) => {
        expect(rcSuccess.isRefreshing).toEqual<boolean>(false)
        ;async () => {
            await delay(5)
            expect(rcSuccess.isRefreshing).toEqual<boolean>(true)
        }
        await rcSuccess.requestRefresh()
        expect(rcSuccess.isRefreshing).toEqual<boolean>(false)
        done()
    })
    test('should publish state appropriately when success', async (done) => {
        let isRefreshingCount = 0
        let hasErrorCount = 0
        let isSuccessCount = 0
        rcSuccess.onStateSetSubject.subscribe((state) => {
            if (state.hasError) {
                hasErrorCount++
            }
            if (state.isRefreshing) {
                isRefreshingCount++
            }
            if (state.isSuccess) {
                isSuccessCount++
            }
        })
        await rcSuccess.requestRefresh()
        expect(isRefreshingCount).toBeGreaterThanOrEqual(2) //true->falseになるので
        expect(isSuccessCount).toBeGreaterThanOrEqual(1)
        expect(hasErrorCount).toEqual(0)
        done()
    })
    test('should publish state appropriately when fail', async (done) => {
        let isRefreshingCount = 0
        let hasErrorCount = 0
        let isSuccessCount = 0
        rcError.onStateSetSubject.subscribe((state) => {
            if (state.hasError) {
                hasErrorCount++
            }
            if (state.isRefreshing) {
                isRefreshingCount++
            }
            if (state.isSuccess) {
                isSuccessCount++
            }
        })
        await rcError.requestRefresh()
        expect(isRefreshingCount).toBeGreaterThanOrEqual(2)
        expect(isSuccessCount).toEqual(0)
        expect(hasErrorCount).toBeGreaterThanOrEqual(1)
        done()
    })
})

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
