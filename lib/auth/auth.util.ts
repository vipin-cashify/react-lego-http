import {getLegoConfig} from '@reglobe/lego-core/config/lego.config';
import {LegoPlatform} from '@reglobe/lego-core/lego-platform/LegoPlatform';
import {isDevelopment} from '@reglobe/lego-core/utils/env.util';
import {LegoAsyncStorage} from '@reglobe/lego-storage/LegoAsyncStorage';

/** Cookie key used on web for user auth. */
export const USER_AUTH = '_user_auth_';

/** Shared storage key used on React Native (MMKV), aligned with app and Flutter. */
export const USER_AUTH_NATIVE_KEY = 'X-User-Auth';

const getDomain = (): string | null => {
    if (isDevelopment() || LegoPlatform.isNative() || LegoPlatform.isWebView()) {
        return null;
    }
    const mode = getLegoConfig()?.mode;
    switch (mode) {
        case 'stage':
            return '.stage.cashify.in';
        case 'beta':
            return '.beta.cashify.in';
        case 'prod':
            return '.cashify.in';
        default:
            return null;
    }
};

const useNativeStorage = (): boolean => LegoPlatform.isNative();

export const setUserAuth = async (auth: string, expireTime: number): Promise<void> => {
    if (useNativeStorage()) {
        const storage = (LegoAsyncStorage as { shared?: { setItem(key: string, value: string): void } }).shared;
        if (storage) {
            storage.setItem(USER_AUTH_NATIVE_KEY, auth);
        }
        return;
    }
    await LegoAsyncStorage.cookie.setItem(USER_AUTH, auth, {
        domain: getDomain(),
        maxAge: expireTime > 0 ? expireTime : undefined
    });
};

export const getUserAuth = async (): Promise<string | null> => {
    if (useNativeStorage()) {
        const storage = (LegoAsyncStorage as { shared?: { getItem(key: string): string | null } }).shared;
        if (storage) {
            return storage.getItem(USER_AUTH_NATIVE_KEY);
        }
        return null;
    }
    return await LegoAsyncStorage.cookie.getItem(USER_AUTH);
};

export const deleteUserAuth = (): void => {
    if (useNativeStorage()) {
        const storage = (LegoAsyncStorage as { shared?: { removeItem(key: string): void } }).shared;
        if (storage) {
            storage.removeItem(USER_AUTH_NATIVE_KEY);
        }
        return;
    }
    const options = {
        domain: getDomain(),
        maxAge: 0
    };
    LegoAsyncStorage.cookie.removeItem(USER_AUTH, options).catch(console.error);
};
