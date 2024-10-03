export const API_ROUTER = {
    // -----------AUTH ROUTES--------
    LOG_IN: '',
    LOG_OUT: '',

    SYMBOLS: 'stocks/get-symbols/',
    OPTIONS_OR_FUTURES: 'stocks/',

    STRATEGY_LIST: 'strategy/',
    STRATEGY_CREATE: 'strategy/create/',
    STRATEGY_UPDATE: (id) => (id ? `strategy/update/${id}/` : 'strategy/update/'),//wokrs with delete also

    
    ORDER_DATE_LIST: (id) => (`orders/dates/${id}/`),
    // ORDER_LIST: (strategyId) => (strategyId ? `orders/${strategyId}/` : `orders/`)
};
