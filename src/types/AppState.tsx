export enum AppState {
    LoggedInReady = 'LOGGED_IN_READY',
    LoggedInNotReady = 'LOGGED_IN_NOT_READY',
    LoggedOutReady = 'LOGGED_OUT_READY',
    LoggedOutNotReady = 'LOGGED_OUT_NOT_READY',
}

export enum AppStateTransition {
    ClientsInitialized = 'CLIENTS_INITIALIZED',
    LoggedIn = 'LOGGED_IN',
    LoggedOut = 'LOGGED_OUT',
    NotReady = 'NOT_READY',
}

export const updateAppReadyState = (
    appReadyStateTransition: string,
    appReadyState: string,
): string => {
    switch (appReadyStateTransition) {
        case AppStateTransition.ClientsInitialized:
            switch (appReadyState) {
                case AppState.LoggedOutNotReady:
                    return AppState.LoggedOutReady;
                case AppState.LoggedInNotReady:
                    return AppState.LoggedInReady;
                case AppState.LoggedInReady:
                    return AppState.LoggedInReady;
                default:
                    return AppState.LoggedOutReady;
            }
        case AppStateTransition.LoggedIn:
            switch (appReadyState) {
                case AppState.LoggedOutNotReady:
                    return AppState.LoggedInNotReady;
                case AppState.LoggedOutReady:
                    return AppState.LoggedInReady;
                case AppState.LoggedInReady:
                    return AppState.LoggedInReady;
                default:
                    return AppState.LoggedInNotReady;
            }
        case AppStateTransition.LoggedOut:
            return AppState.LoggedOutReady;
        case AppStateTransition.NotReady:
            return AppState.LoggedInNotReady;
    }
    return AppState.LoggedOutNotReady;
};
