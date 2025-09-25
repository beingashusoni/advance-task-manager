const KEY = 'atm_revamp_state_v1'

export const loadState = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export const saveState = (s) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch (e) {}
}



export const exportStateJSON = (state) => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: 'application/json',
  })
  return URL.createObjectURL(blob)
}

export const parseImportedJSON = async (file) => {
  try {
    const text = await file.text()
    return JSON.parse(text)
  } catch (e) {
    console.error('Failed to parse imported file:', e)
    return null
  }
}
