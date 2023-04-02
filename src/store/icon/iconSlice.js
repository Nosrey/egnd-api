import { createSlice } from '@reduxjs/toolkit'

const iconSlice = createSlice({
    name: 'icon',
    initialState: true,
    reducers: {
        setFalse: (state) => !state,
    },
})

export const { setFalse } = iconSlice.actions
export default iconSlice.reducer
