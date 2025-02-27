export const API_ROUTER = {
    // -----------AUTH AND USER ROUTES--------
    LOG_IN: "user/login/",
    REGISTER: "user/register-user/",
    VERIFY_CODE: "user/verify-user/",
    FORGOT_PASSWORD: "user/request-password-reset/",
    RESET_PASSWORD_CODE:"user/password-reset/",
    CHANGE_PASSWORD :"user/change-password/",
    USER_PROFILE:"user/profile/",
    USER_CONTACTUS:"user/contact-us/",
  

    SYMBOLS: 'stocks/get-symbols/',
    GET_FUTURE_EXPIRY:"stocks/get-future-expiry/",
    GET_STRIKE_PRICE :"stocks/get-strike-price/",
    ADD_POSITION : "stocks/add-position/",
    ALL_POSITION : "stocks/all-position/",

    STRATEGY_LIST: 'strategy/',
    STRATEGY_CREATE: 'strategy/create/',
    LOT_SIZES:'strategy/get-symbols/', //for lot sizes according to stock
    STRATEGY_PREBUILD:(name)=>(name?`/strategy/pre-build/?name=${name}`: '/strategy/pre-build/'),
    STRATEGY_UPDATE: (id) => (id ? `strategy/update/${id}/` : 'strategy/update/'), //wokrs with delete also
    STRATEGY_STATUS:(strategyId)=>(`strategy/status/${strategyId}/`),
    STRATEGY_ON_OFF_ALL:'strategy/on-off-all/',

    
    ORDER_DATE_LIST: (id) => (`orders/dates/${id}/`),
    ORDER_LIST: (id, selectedDate, positionType) => {
        const baseUrl = `orders/${id}/?date=${selectedDate}`;
        return positionType ? `${baseUrl}&position_type=${positionType}` : baseUrl;
      },


    ADD_BROKER:'broker/add/',
    UPDATE_BROKER:'broker/update/',
};
