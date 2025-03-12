import { createSlice, asyncThunkCreator } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/utils/constant'
import { mapOrder } from '~/utils/sort'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const initialState = {
  currentActiveBoard : null
}

export const fetchBoardDetailsAPI = asyncThunkCreator(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data // này sẽ là payload khi dispatch func
  }
)

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // reducer sẽ xử lý đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      state.currentActiveBoard = action.payload
    }
  },
  //xử lý bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      const board = action.payload
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id' )
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
        else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })
      state.currentActiveBoard = board
    })
  }
})


export const { updateCurrentActiveBoard } = activeBoardSlice.actions

//Selector
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

export default activeBoardSlice.reducer