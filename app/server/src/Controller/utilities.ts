type SuccessResult<T> = { success: true, result: T, error: null };
type ErrorResult = { success: false, result: null, error: any };

export async function protectedCall<T>(func: () => Promise<T>): Promise<SuccessResult<T> | ErrorResult> {
    try {
        const res = await func();
        return {
            success: true,
            result: res,
            error: null
        };
    } catch (error: unknown) {
        return {
            success: false,
            result: null,
            error: error
        };
    }
}