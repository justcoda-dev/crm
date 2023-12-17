import { ROLES } from '~/constants/acl'

let l = ''

export const langSet = lang => {
  if (lang === 'ru') {
    l = '/ru'
  } else if (lang === 'ua') {
    l = '/ua'
  } else if (lang === 'it') {
    l = '/it'
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
    EDIT: id => `${l}/point/${id}`,
    SCHEDULE: id => `${l}/point/schedule/${id}`,
    WINDOWS: id => `${l}/point/windows/${id}`,
    SETTINGS: id => `${l}/point/settings/${id}`,
    AUDIENCE: id => `${l}/point/audience/${id}`,
    LOG: id => `${l}/point/log/${id}`,
  },
  NET: {
    LIST: () => `${l}/net`,
  },
  PLAYLIST: {
    LIST: () => `${l}/playlist`,
    CREATE: () => `${l}/playlist/create`,
    EDIT: id => `${l}/playlist/${id}`,
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
    EDIT: id => `${l}/user/${id}`,
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
