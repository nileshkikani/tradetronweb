export const API_ROUTER = {
    // -----------AUTH AND USER ROUTES--------
    LOG_IN: "user/login/",
    REGISTER: "user/register-user/",
    VERIFY_CODE: "user/verify-user/",
    REFRESH_TOKEN:'user/token-refresh/',
    FORGOT_PASSWORD: "user/request-password-reset/",
    RESET_PASSWORD_CODE:"user/password-reset/",
    CHANGE_PASSWORD :"user/change-password/",
    USER_PROFILE:"user/profile/",
    USER_CONTACTUS:"user/contact-us/",
    ORDER_CLOSE:"orders/close/",

    SYMBOLS: 'stocks/get-symbols/',
    GET_FUTURE_EXPIRY:"stocks/get-future-expiry/",
    GET_STRIKE_PRICE :"stocks/get-strike-price/",
    ADD_POSITION : "stocks/add-position/",
    ALL_POSITION : "stocks/all-position/",

    STRATEGY_LIST: 'paper_trade/strategy/',
    STRATEGY_CREATE: 'paper_trade/strategy/create/',
    LOT_SIZES:'paper_trade/strategy/get-symbols/', //for lot sizes according to stock
    STRATEGY_PREBUILD:(name)=>(name?`paper_trade/strategy/pre-build/?name=${name}`: 'paper_trade/strategy/pre-build/'),
    STRATEGY_UPDATE: (id) => (id ? `paper_trade/strategy/update/${id}/` : 'paper_trade/strategy/update/'), //wokrs with delete also
    STRATEGY_STATUS:(strategyId)=>(`paper_trade/strategy/status/${strategyId}/`),
    STRATEGY_ON_OFF_ALL:'paper_trade/strategy/on-off-all/',

    
    ORDER_DATE_LIST: (id) => (`paper_trade/orders/dates/${id}/`),
    ORDER_LIST: (id, selectedDate, symbol) => {
        const baseUrl = `paper_trade/orders/${id}/?date=${selectedDate}`;
        return symbol ? `${baseUrl}&symbol=${symbol}` : baseUrl;
      },


    ADD_BROKER:'paper_trade/broker/add/',
    UPDATE_BROKER:'paper_trade/broker/update/',
};
