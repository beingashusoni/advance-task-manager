import { nanoid } from 'nanoid'
export const ACTIONS = {
  ADD_BOARD:'ADD_BOARD', DELETE_BOARD:'DELETE_BOARD',
  ADD_LIST:'ADD_LIST', RENAME_LIST:'RENAME_LIST', DELETE_LIST:'DELETE_LIST',
  ADD_TASK:'ADD_TASK', EDIT_TASK:'EDIT_TASK', DELETE_TASK:'DELETE_TASK',
  MOVE_TASK:'MOVE_TASK', ADD_LABEL:'ADD_LABEL', REMOVE_LABEL:'REMOVE_LABEL',
  SET_DUE_DATE:'SET_DUE_DATE', ASSIGN_USER:'ASSIGN_USER', UNASSIGN_USER:'UNASSIGN_USER',
  SET_STATE:'SET_STATE'
}
export const initialState = { boards: [] }
function addLog(board, message){
  const entry = { id: nanoid(), message, time: new Date().toISOString() }
  return { ...board, activity: [entry, ...(board.activity||[])].slice(0,50) }
}
export function boardsReducer(state, action){
  switch(action.type){
    case ACTIONS.SET_STATE: return action.payload
    case ACTIONS.ADD_BOARD: {
      const newBoard = { id: nanoid(), name: action.payload.name, lists:[
        { id: nanoid(), name: 'To Do', tasks: [] },
        { id: nanoid(), name: 'In Progress', tasks: [] },
        { id: nanoid(), name: 'Done', tasks: [] }
      ], activity: [] }
      return { ...state, boards: [...state.boards, newBoard] }
    }
    case ACTIONS.DELETE_BOARD:
      return { ...state, boards: state.boards.filter(b=>b.id!==action.payload.boardId) }
    case ACTIONS.ADD_LIST:
      return { ...state, boards: state.boards.map(b=> b.id===action.payload.boardId? {...b, lists:[...b.lists, { id: nanoid(), name: action.payload.name, tasks: [] }]}:b) }
    case ACTIONS.RENAME_LIST:
      return { ...state, boards: state.boards.map(b=> b.id===action.payload.boardId? {...b, lists: b.lists.map(l=> l.id===action.payload.listId? {...l, name: action.payload.name}: l)}: b) }
    case ACTIONS.DELETE_LIST:
      return { ...state, boards: state.boards.map(b=> b.id===action.payload.boardId? {...b, lists: b.lists.filter(l=> l.id!==action.payload.listId)}: b) }
    case ACTIONS.ADD_TASK:{
      const { boardId, listId, title } = action.payload
      const task = { id: nanoid(), title, description:'', labels:[], dueDate:null, assignees:[] }
      return {
        ...state,
        boards: state.boards.map(b=>{
          if(b.id!==boardId) return b
          const updated = {...b, lists: b.lists.map(l=> l.id===listId? {...l, tasks: [...l.tasks, task]}: l)}
          return addLog(updated, `Task "${title}" added to ${b.lists.find(l=>l.id===listId)?.name}`)
        })
      }
    }
    case ACTIONS.EDIT_TASK:{
      const { boardId, listId, taskId, updates } = action.payload
      return {
        ...state,
        boards: state.boards.map(b=>{
          if(b.id!==boardId) return b
          const updated = {...b, lists: b.lists.map(l=> l.id===listId? {...l, tasks: l.tasks.map(t=> t.id===taskId? {...t, ...updates}: t)}: l)}
          return addLog(updated, `Task "${updates.title||'(edited)'}" updated`)
        })
      }
    }
    case ACTIONS.DELETE_TASK:{
      const { boardId, listId, taskId } = action.payload
      return {
        ...state,
        boards: state.boards.map(b=>{
          if(b.id!==boardId) return b
          const list = b.lists.find(l=>l.id===listId)
          const deleted = list?.tasks.find(t=>t.id===taskId)?.title || ''
          const updated = {...b, lists: b.lists.map(l=> l.id===listId? {...l, tasks: l.tasks.filter(t=> t.id!==taskId)}: l)}
          return addLog(updated, `Task "${deleted}" deleted from ${list?.name}`)
        })
      }
    }
    case ACTIONS.MOVE_TASK:{
      const { boardId, fromListId, toListId, fromIndex, toIndex } = action.payload
      const board = state.boards.find(b=>b.id===boardId); if(!board) return state
      const from = board.lists.find(l=>l.id===fromListId); const to = board.lists.find(l=>l.id===toListId)
      const task = from.tasks[fromIndex]; const newFrom = [...from.tasks]; newFrom.splice(fromIndex,1)
      const newTo = [...to.tasks]; newTo.splice(toIndex,0,task)
      const newBoard = {...board, lists: board.lists.map(l=>{
        if(l.id===fromListId) return {...l, tasks:newFrom}
        if(l.id===toListId) return {...l, tasks:newTo}
        return l
      })}
      return {...state, boards: state.boards.map(b=> b.id===boardId? addLog(newBoard, `Task "${task.title}" moved`): b)}
    }
    case ACTIONS.ADD_LABEL:{
      const { boardId, listId, taskId, label } = action.payload
      return {...state, boards: state.boards.map(b=> b.id===boardId? {...b, lists: b.lists.map(l=> l.id===listId? {...l, tasks: l.tasks.map(t=> t.id===taskId && !t.labels.includes(label)? {...t, labels:[...t.labels, label]}:t)}:l)}:b)}
    }
    case ACTIONS.REMOVE_LABEL:{
      const { boardId, listId, taskId, label } = action.payload
      return {...state, boards: state.boards.map(b=> b.id===boardId? {...b, lists: b.lists.map(l=> l.id===listId? {...l, tasks: l.tasks.map(t=> t.id===taskId? {...t, labels: t.labels.filter(x=> x!==label)}:t)}:l)}:b)}
    }
    case ACTIONS.SET_DUE_DATE:{
      const { boardId, listId, taskId, dueDate } = action.payload
      return {...state, boards: state.boards.map(b=> b.id===boardId? {...b, lists: b.lists.map(l=> l.id===listId? {...l, tasks: l.tasks.map(t=> t.id===taskId? {...t, dueDate}:t)}:l)}:b)}
    }
    case ACTIONS.ASSIGN_USER:{
      const { boardId, listId, taskId, userId } = action.payload
      return {...state, boards: state.boards.map(b=> b.id===boardId? {...b, lists: b.lists.map(l=> l.id===listId? {...l, tasks: l.tasks.map(t=> t.id===taskId && !t.assignees.includes(userId)? {...t, assignees:[...t.assignees, userId]}:t)}:l)}:b)}
    }
    case ACTIONS.UNASSIGN_USER:{
      const { boardId, listId, taskId, userId } = action.payload
      return {...state, boards: state.boards.map(b=> b.id===boardId? {...b, lists: b.lists.map(l=> l.id===listId? {...l, tasks: l.tasks.map(t=> t.id===taskId? {...t, assignees: t.assignees.filter(x=> x!==userId)}:t)}:l)}:b)}
    }
    default: return state
  }
}
