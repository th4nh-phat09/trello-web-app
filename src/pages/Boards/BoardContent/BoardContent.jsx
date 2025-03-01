import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { useState, useEffect, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Card from './ListColumns/Column/ListCards/Card/Card'
import Column from './ListColumns/Column/Column'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { TouchSensor, MouseSensor } from '~/customLib/dndKitSensors'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN : 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD : 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
const BoardContent = ({ board, createNewColumn, createNewCard, moveColumns, moveCardsInTheSameColumn, moveCardsToDiffColumn }) => {
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
  const [orderColumns, setOrderColumns] = useState([])
  // Cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnDraggingCard, setOldColumnDraggingCard] = useState(null)
  //trang thai truoc cua overid de lo nhu null thi lay gia tri truoc
  const lastOverId = useRef(null)
  // useEffect để lấy dữ liệu columns từ board và set vào state orderColumns
  useEffect(() => { setOrderColumns(board?.columns)}, [board])

  //func find Column By card Id
  const findColumnByCardId = (cardId) => {
    return orderColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
    // return orderColumns.find(column => column?.cardOrderIds?.includes(cardId))
  }
  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN)
      return closestCorners({ ...args })
    // First, let's see if there are any collisions with the pointer
    const pointerIntersections = pointerWithin(args)
    //fix flickering drag card between columns
    if (!pointerIntersections?.length) return
    // console.log(args)
    // const intersections = !!pointerIntersections?.length ? pointerIntersections: rectIntersection(args)
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      lastOverId.current = overId
      // fix overId if overId = id of column to id of card = alg closestCenter
      const checkColumn = orderColumns.find(column => column._id === overId )
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
          ) })[0]?.id
      }
      return [{ id: overId }]
    }

    return lastOverId ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderColumns])
  const moveCardBetweenDifferentColumns =(
    activeDraggingCardData,
    activeDraggingCardId,
    activeColumn,
    overColumn,
    over,
    active,
    overCardId,
    triggerFrom
  ) => {
    setOrderColumns(prevColumn => {
      //find overCardIndex
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      // find newCardIndex index
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      //clone columns for avoid conflict data
      const nextColumns = cloneDeep(prevColumn)
      //find next next active,over Column
      const nextActiveColumn = nextColumns?.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns?.find(column => column._id === overColumn._id)
      // remove card in old column
      if (nextActiveColumn) {
        //remove card in old column
        nextActiveColumn.cards = nextActiveColumn?.cards?.filter(card => card._id !== activeDraggingCardId )
        //check columns empty => add card placeholder
        if (isEmpty(nextActiveColumn?.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //update cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map(card => card._id)
      }
      // update card in over column
      if (nextOverColumn) {
        //remove card in new column if it is ton tai roi
        nextOverColumn.cards = nextOverColumn?.cards?.filter(card => card._id !== activeDraggingCardId )
        const rebuildActiveDraggingCardData ={
          ...activeDraggingCardData,
          columnId: overColumn._id
        }
        //add card to new column
        nextOverColumn.cards = nextOverColumn?.cards?.toSpliced(newCardIndex, 0, rebuildActiveDraggingCardData)
        //delete placeholder card if column have
        nextOverColumn.cards = nextOverColumn?.cards?.filter(card => !card.FE_Placeholder)
        //update cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map(card => card._id)
      }
      if (triggerFrom === 'handleDragEnd') {
        moveCardsToDiffColumn(
          activeDraggingCardId,
          oldColumnDraggingCard._id,
          nextActiveColumn._id,
          nextColumns
        )
      }
      return nextColumns
    }
    )
  }
  const handleDragStart = (event) => {
    //console.log('start', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    if (event?.active?.data?.current?.columnId) {
      setOldColumnDraggingCard(findColumnByCardId(event?.active?.id))
    }
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
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(activeDraggingCardData,
        activeDraggingCardId,
        activeColumn,
        overColumn,
        over,
        active,
        overCardId,
        'handleDragOver'
      )
    }
  }
  const handleDragEnd = (event) => {

    //console.log('eee', event)
    // event end kéo thả, check thong tin của active và over
    //card active and over active from event
    const { active, over } = event
    // Lấy in4 của element đc kéo (active) và element bị kéo tới (over)
    if (!active || !over) return
    // Nếu 0 có element over,return => fix bug over bi keo ra bien

    //check drag card is active => do nothing
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // id of active and over
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over
      // Find column by cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // Check over and active column is undified
      if (!activeColumn || !overColumn) return

      if (oldColumnDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(activeDraggingCardData,
          activeDraggingCardId,
          activeColumn,
          overColumn,
          over,
          active,
          overCardId,
          'handleDragEnd'
        )
      } else {
        // check nếu card dc kéo != với card bị kéo tới
        const oldCardIndex = oldColumnDraggingCard?.cards?.findIndex(card => card._id === activeDragItemId)
        // Tìm vị trí ban đầu (index) của card dang dc kéo in column
        const newCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        // Tìm vị trí mới (index) của card bị kéo tới in column
        const dndOrderedCards = arrayMove(overColumn?.cards, oldCardIndex, newCardIndex)
        // arrayMove là hàm sắp xếp lại array vị trí mới
        const dndOrderCardIds = dndOrderedCards?.map(card => card._id)
        setOrderColumns(prevColumn => {
          //clone columns for avoid conflict data
          const nextColumns = cloneDeep(prevColumn)
          const targetColumn = nextColumns?.find(column => column?._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderCardIds
          return nextColumns
        })
        moveCardsInTheSameColumn(dndOrderedCards, dndOrderCardIds, overColumn._id)
      }
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // check nếu column dc kéo != với column bị kéo tới
        const oldColumnIndex = orderColumns.findIndex(column => column._id === active.id)
        // Tìm vị trí ban đầu (index) của column dang dc kéo in array
        const newColumnIndex = orderColumns.findIndex(column => column._id === over.id)
        // Tìm vị trí mới (index) của column bị kéo tới in array
        const dndOrderColumns = arrayMove(orderColumns, oldColumnIndex, newColumnIndex)
        // Update lại state orderColumns = use hàm arrayMove
        setOrderColumns(dndOrderColumns)
        // arrayMove là hàm sắp xếp lại array vị trí mới
        moveColumns(dndOrderColumns)
        //gọi api để update columns trong database và truyền ngược lên cho component cha ở _id.jsx
      }}
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnDraggingCard(null)
  }

  const customDropAnimation = { sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }
  // State orderColumns để lưu thứ tự cột

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      // collisionDetection={closestCorners}>
      collisionDetection={collisionDetectionStrategy}>
      <Box sx={{
        height: (theme) => theme.trello.boardContentHeight,
        width: '100%',
        p:'10px 0',
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
      }}>
        {/* List Columns */}
        <ListColumns columns={orderColumns} createNewColumn={createNewColumn} createNewCard={createNewCard} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
