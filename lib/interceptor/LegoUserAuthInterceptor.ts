import {UserConstants} from '@reglobe/lego-core/constants/user.constants';
import {LegoBroadcast} from '@reglobe/lego-core/lego-broadcast/LegoBroadcast';
import {LegoFetchInterceptor} from '@reglobe/lego-fetch/LegoFetchInterceptor';
import type {LegoFetchRequest} from '@reglobe/lego-fetch/LegoFetchRequest';
import type {LegoFetchResponse} from '@reglobe/lego-fetch/LegoFetchResponse';

import {authEvent} from '../auth/auth-event';
import {deleteUserAuth, getUserAuth} from '../auth/auth.util';

export class LegoUserAuthInterceptor extends LegoFetchInterceptor {

    async interceptRequest(request: LegoFetchRequest): Promise<LegoFetchRequest | LegoFetchResponse> {
        request.init = request?.init || {};
        const allowAuth = request?.init?.userAuth;

        if (!allowAuth) {
            return super.interceptRequest(request);
        }
        const auth = await getUserAuth();
        if (auth) {
            request.init.headers = {
                ...request.init.headers,
                'X-USER-AUTH': auth
            }
        }
        return super.interceptRequest(request);
    }

    async interceptResponse(request: LegoFetchRequest, response: LegoFetchResponse): Promise<LegoFetchResponse> {
        const allowAuth = request?.init?.userAuth;
        if (allowAuth && response.status === 421) {
            deleteUserAuth();
            LegoBroadcast.instance.broadcast(UserConstants.USER_INFO_DELETE);
            LegoBroadcast.instance.broadcast(authEvent.sessionExpire);
        }
        return super.interceptResponse(request, response);
    }
}
