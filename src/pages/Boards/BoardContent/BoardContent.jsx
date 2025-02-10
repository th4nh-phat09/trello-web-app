import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Card from './ListColumns/Column/ListCards/Card/Card'
import Column from './ListColumns/Column/Column'
import { cloneDeep } from 'lodash'
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN : 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD : 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
const BoardContent = ({ board }) => {
  // default is pointerSensor ,if use default you should use touch action none
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  })

  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 500
    }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  //func find Column By card Id
  const findColumnByCardId = (cardId) => {
    return orderColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
    // return orderColumns.find(column => column?.cardOrderIds?.includes(cardId))
  }

  const handleDragStart = (event) => {
    //console.log('start', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragOver = (event) => {
    //check drag column is active => do nothing
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    //card active and over active from event
    const { active, over } = event
    if (!active || !over) return
    // id of active and over
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over
    // Find column by cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // Check over and active column is undified
    if (!activeColumn || !overColumn) return
    if (activeColumn !== overColumn) {
      setOrderColumns(prevColumn => {
        //clone columns for avoid conflict data
        const nextColumns = cloneDeep(prevColumn)
        //find overCardIndex
        const overCardIndex = overColumn?.cards?.findIndex(card => card.id === overCardId)
        // find newCardIndex index
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
        //find next next active,over Column
        const nextActiveColumn = nextColumns?.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns?.find(column => column._id === overColumn._id)
        // remove card in old column
        if (nextActiveColumn) {
          //remove card in old column
          nextActiveColumn.cards = nextActiveColumn?.cards?.filter(card => card._id !== activeDraggingCardId )
          //update cardOrderIds
          nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map(card => card._id)
        }

        // update card in over column
        if (nextOverColumn) {
          //remove card in new column if it is ton tai roi
          nextOverColumn.cards = nextOverColumn?.cards?.filter(card => card._id !== activeDraggingCardId )
          //add card to new column
          nextOverColumn.cards = nextOverColumn?.cards?.toSpliced(newCardIndex, 0, activeDraggingCardData)
          //update cardOrderIds
          nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map(card => card._id)
        }
        return nextColumns
      }
      )
    }
  }
  const handleDragEnd = (event) => {
    //check drag card is active => do nothing
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) return
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    //console.log('eee', event)
    // event end kéo thả, check thong tin của active và over
    //card active and over active from event
    const { active, over } = event
    // Lấy in4 của element đc kéo (active) và element bị kéo tới (over)
    if (!active || !over) return
    // Nếu 0 có element over,return => fix bug over bi keo ra bie
    if (active.id !== over.id) {
      // check nếu element dc kéo != với element bị kéo tới
      const oldIndex = orderColumns.findIndex(column => column._id === active.id)
      // Tìm vị trí ban đầu (index) của element dang dc kéo in array
      const newIndex = orderColumns.findIndex(column => column._id === over.id)
      // Tìm vị trí mới (index) của element bị kéo tới in array
      setOrderColumns(arrayMove(orderColumns, oldIndex, newIndex))
      // Update lại state orderColumns = use hàm arrayMove
      // arrayMove là hàm sắp xếp lại array vị trí mới
    }}

  const customDropAnimation = { sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }
  // State orderColumns để lưu thứ tự cột
  const [orderColumns, setOrderColumns] = useState([])
  // Cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  // useEffect để lấy dữ liệu columns từ board và set vào state orderColumns
  useEffect(() => { setOrderColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id' ))}, [board])
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver}>
      <Box sx={{
        height: (theme) => theme.trello.boardContentHeight,
        width: '100%',
        p:'10px 0',
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
      }}>
        {/* List Columns */}
        <ListColumns columns={orderColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
