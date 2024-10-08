import { createSlice } from '@reduxjs/toolkit';

import { calendar } from 'src/mocks/calendar';

const initialState = {
  events: []
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents(state, action) {
      state.events = action.payload;
    },
    createEvent(state, action) {
      state.events.push(action.payload);
    },
    updateEvent(state, action) {
      const event = action.payload;

      state.events = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }

        return _event;
      });
    },
    deleteEvent(state, action) {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    }
  }
});

export const { reducer } = slice;

export const getEvents = () => async (dispatch) => {
  const data = await calendar.getEvents();
  dispatch(slice.actions.getEvents(data));
};

export const createEvent = (createData) => async (dispatch) => {
  const data = await calendar.createEvent(createData);
  dispatch(slice.actions.createEvent(data));
};

export const updateEvent = (eventId, update) => async (dispatch) => {
  const data = await calendar.updateEvent({
    eventId,
    update
  });

  dispatch(slice.actions.updateEvent(data));
};

export const deleteEvent = (eventId) => async (dispatch) => {
  await calendar.deleteEvent(eventId);
  dispatch(slice.actions.deleteEvent(eventId));
};

export default slice;
