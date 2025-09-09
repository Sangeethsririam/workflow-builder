import { configureStore } from '@reduxjs/toolkit'
import workflowReducer from './features/workflowSlice.js'

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
})
