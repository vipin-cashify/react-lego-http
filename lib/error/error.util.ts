/**
 * Parses the error code from a fetch/API error (e.g. LegoFetchError from legoParseFetchError).
 * Checks error.code first, then parses error.body as JSON for code, errorCode, or error_code.
 */
export function parseErrorCode(error: any): string | number | undefined {
    if (error?.code !== undefined && error?.code !== null) return error.code;
    if (typeof error?.body === 'string') {
        try {
            const parsed = JSON.parse(error.body);
            return parsed?.code ?? parsed?.errorCode ?? parsed?.error_code;
        } catch {
            return undefined;
        }
    }
    return undefined;
}
