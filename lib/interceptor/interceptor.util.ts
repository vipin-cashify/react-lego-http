import {getLegoConfig} from '@reglobe/lego-core/config/lego.config';
import type {LegoServiceType} from '@reglobe/lego-core/lego-service/lego-service-type';
import {LegoService} from '@reglobe/lego-core/lego-service/LegoService';
import {LegoSource} from '@reglobe/lego-core/lego-source/LegoSource';
import {LegoFetch} from '@reglobe/lego-fetch/LegoFetch';
import type {LegoFetchInterceptor} from '@reglobe/lego-fetch/LegoFetchInterceptor';

import {commonInterceptorConstants} from './interceptor.constants';
import {LegoUserAuthInterceptor} from './LegoUserAuthInterceptor';

function initializeFetchClientWithInterceptor(
    serviceType: LegoServiceType,
    platform: 'native',
    disableProxy: boolean,
    lruCache?: boolean,
    extraInterceptor?: Map<string, LegoFetchInterceptor>,
    bundleVersion?: string,
    buildVersion?: string
): void {
    const moduleMeta = LegoService.instance.findServiceByType(serviceType);
    const legoConfig = getLegoConfig();
    LegoFetch.instance.init({
        apiUrl: legoConfig.apiUrl,
        baseUrl: legoConfig.baseUrl,
        authUrl: legoConfig.authUrl,
        platform,
        lruCache,
        moduleMetadata: {
            serviceType,
            moduleName: moduleMeta.moduleName,
            bundleVersion,
            buildVersion,
            appInstaller: LegoSource.getSource().name
        },
        commonHeaders: legoConfig.commonHeaders,
        disableProxy,
        extraInterceptor
    }).catch(reason => {
        console.error('Failed to initialize fetch client', reason);
    });
}

export function initializeHttpNative(
    serviceType: LegoServiceType,
    lruCache?: boolean,
    fetchExtraInterceptor?: Map<string, LegoFetchInterceptor>,
    bundleVersion?: string,
    buildVersion?: string
): void {
    const fetchInterceptorMap = new Map<string, LegoFetchInterceptor>(fetchExtraInterceptor);
    fetchInterceptorMap.set(commonInterceptorConstants.USER_AUTH_HEADER, new LegoUserAuthInterceptor());
    initializeFetchClientWithInterceptor(serviceType, 'native', true, lruCache, fetchInterceptorMap, bundleVersion, buildVersion);
}
