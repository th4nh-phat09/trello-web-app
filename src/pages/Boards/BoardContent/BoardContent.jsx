import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Card from './ListColumns/Column/ListCards/Card/Card'
import Column from './ListColumns/Column/Column'
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

  const handleDragStart = (event) => {
    //console.log('start', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragEnd = (event) => {
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    //console.log('eee', event)
    // event end kéo thả, check thong tin của active và over
    const { active, over } = event
    // Lấy in4 của element đc kéo (active) và element bị kéo tới (over)
    if (!over) return
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
    <DndContext onDragEnd={handleDragEnd} sensors={sensors} onDragStart={handleDragStart}>
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
