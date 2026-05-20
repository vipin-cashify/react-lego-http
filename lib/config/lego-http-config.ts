export enum LegoAuthHeaderType {
    USER_AUTH = 'X-USER-AUTH',
    SSO_TOKEN = 'X-SSO-TOKEN',
}

let authHeader: LegoAuthHeaderType = LegoAuthHeaderType.USER_AUTH;

export const setLegoHttpAuthHeader = (header: LegoAuthHeaderType): void => {
    authHeader = header;
};

export const getLegoHttpAuthHeader = (): LegoAuthHeaderType => authHeader;
