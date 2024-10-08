import { createSlice } from '@reduxjs/toolkit';

import { projects_board } from 'src/mocks/projects_board';

import objectArray from 'src/utils/objectArray';

const initialState = {
  isLoaded: false,
  lists: {
    byId: {},
    allIds: []
  },
  tasks: {
    byId: {},
    allIds: []
  },
  members: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'projects_board',
  initialState,
  reducers: {
    getProject(state, action) {
      const project = action.payload;

      state.lists.byId = objectArray(project.lists);
      state.lists.allIds = Object.keys(state.lists.byId);
      state.tasks.byId = objectArray(project.tasks);
      state.tasks.allIds = Object.keys(state.tasks.byId);
      state.members.byId = objectArray(project.members);
      state.members.allIds = Object.keys(state.members.byId);
      state.isLoaded = true;
    },
    updateList(state, action) {
      const list = action.payload;
      state.lists.byId[list.id] = list;
    },

    moveTask(state, action) {
      const { taskId, position, listId } = action.payload;
      const sourceListId = state.tasks.byId[taskId].listId;

      state.lists.byId[sourceListId].taskIds = state.lists.byId[
        sourceListId
      ].taskIds.filter((_taskId) => _taskId !== taskId);

      if (listId) {
        state.tasks.byId[taskId].listId = listId;
        state.lists.byId[listId].taskIds.splice(position, 0, taskId);
      } else {
        state.lists.byId[sourceListId].taskIds.splice(position, 0, taskId);
      }
    }
  }
});

export const { reducer } = slice;

export const getProject = () => async (dispatch) => {
  const response = await projects_board.getProject();
  dispatch(slice.actions.getProject(response));
};

export const updateList = (listId, update) => async (dispatch) => {
  const response = await projects_board.updateList({ listId, update });
  dispatch(slice.actions.updateList(response));
};

export const moveTask = (taskId, position, listId) => async (dispatch) => {
  await projects_board.moveTask({ taskId, position, listId });
  dispatch(
    slice.actions.moveTask({
      taskId,
      position,
      listId
    })
  );
};
