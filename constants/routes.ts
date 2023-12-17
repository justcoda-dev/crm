import {ROLES} from "./acl"
import {ID} from "../TS/types"

let l = ''

export const langSet = (lang: string) => {
    if (lang === 'ru') {
        l = '/ru'
    } else if (lang === 'ua') {
        l = '/ua'
    } else if (lang === 'eng') {
        l = '/eng'
    } else {
        l = ''
    }
}

const ROUTE = {
    ROOT: () => `${l}/`,
    LOGIN: () => `${l}/login`,
    REGISTRATION: () => `${l}/reg`,
    RECOVER_PASS: () => `${l}/recover-pass`,
    AUTOLOGIN: () => `${l}/login/auto`,
    ACCOUNT: () => `${l}/account`,
    SECURITY: () => `${l}/account-security`,
    MEMBERS: () => `${l}/account-members`,
    FUNDS: () => `${l}/funds`,
    POINT: {
        LIST: () => `${l}/point`,
        EDIT: (id: ID) => `${l}/point/${id}`,
        SCHEDULE: (id: ID) => `${l}/point/schedule/${id}`,
        WINDOWS: (id: ID) => `${l}/point/windows/${id}`,
        SETTINGS: (id: ID) => `${l}/point/settings/${id}`,
        AUDIENCE: (id: ID) => `${l}/point/audience/${id}`,
        LOG: (id: ID) => `${l}/point/log/${id}`,
    },
    NET: {
        LIST: () => `${l}/net`,
    },
    PLAYLIST: {
        LIST: () => `${l}/playlist`,
        CREATE: () => `${l}/playlist/create`,
        EDIT: (id: ID) => `${l}/playlist/${id}`,
    },
    FILES: {
        HOME: () => `${l}/files`,
        STOCK: () => `${l}/files/stock`,
        RECENT: () => `${l}/files/recent`,
        FAVORITE: () => `${l}/files/favorite`,
        CREATION: () => `${l}/creations`,
        PLUGIN: () => `${l}/plugins`,
        WIDGET: () => `${l}/widgets`,
    },
    STATISTICS: {
        REPORT: () => `${l}/statistics/report`,
        BY_INSTANCES: () => `${l}/statistics/report-by-instances`,
        BY_FILES: () => `${l}/statistics/report-by-files`,
        LIST: () => `${l}/statistics/list`,
    },
    IMPRESSIONS: {
        HOME: () => `${l}/impressions`,
    },
    USER: {
        LIST: () => `${l}/user`,
        CREATE: () => `${l}/user/create`,
        EDIT: (id: ID) => `${l}/user/${id}`,
    },
    ADMIN: {
        LIST: () => `${l}/admin`,
    },
}

export const DEFAULT_ROUTES_BY_ROLES = {
    [ROLES.ADMIN]: ROUTE.ROOT(),
    [ROLES.OWNER]: ROUTE.ROOT(),
    [ROLES.MODERATOR]: ROUTE.ROOT(),
    [ROLES.AGENT]: ROUTE.PLAYLIST.LIST(),
    [ROLES.OBSERVER]: ROUTE.STATISTICS.REPORT(),
}

export const POINT_TABS = {
    CONTENT: 'content',
    SCHEDULE: 'schedule',
    SETTINGS: 'settings',
    WINDOWS: 'windows',
    AUDIENCE: 'audience',
    LOG: 'log',
}

export default ROUTE
