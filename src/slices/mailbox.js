import { createSlice } from '@reduxjs/toolkit';

import { mailbox } from 'src/mocks/mailbox';

import objectArray from 'src/utils/objectArray';

const initialState = {
  mails: {
    byId: {},
    allIds: []
  },
  tags: [],
  sidebarOpen: false
};

const slice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    getTags(state, action) {
      state.tags = action.payload;
    },
    getMails(state, action) {
      const mails = action.payload;

      state.mails.byId = objectArray(mails);
      state.mails.allIds = Object.keys(state.mails.byId);
    },
    getMail(state, action) {
      const mail = action.payload;

      state.mails.byId[mail.id] = mail;

      if (!state.mails.allIds.includes(mail.id)) {
        state.mails.allIds.push(mail.id);
      }
    },
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    }
  }
});

export const { reducer } = slice;

export const getTags = () => async (dispatch) => {
  const response = await mailbox.getTags();
  dispatch(slice.actions.getTags(response));
};

export const getMails =
  ({ tag }) =>
  async (dispatch) => {
    const response = await mailbox.getMails({ tag });

    dispatch(slice.actions.getMails(response));
  };

export const getMail = (mailId) => async (dispatch) => {
  const response = await mailbox.getMail(mailId);

  dispatch(slice.actions.getMail(response));
};

export const openSidebar = () => async (dispatch) => {
  dispatch(slice.actions.openSidebar());
};

export const closeSidebar = () => async (dispatch) => {
  dispatch(slice.actions.closeSidebar());
};
