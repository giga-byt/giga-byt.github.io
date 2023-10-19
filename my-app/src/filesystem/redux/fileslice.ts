import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { MFTuple, MyFile } from '../FileSystem'
import { Path } from '../../terminal/MyTerminalContext'

// Define a type for the slice state
interface FSState {
    files: Array<MFTuple>,
    count: number
}

// Define the initial state using that type
const initialState: FSState = {
    files: [
        ['/', true, ''],
        ['/README.md', false, 'This is a readme.'],
        ['/bin', true, ''],
        ['/bin/exec', false, '101010101110101010101'],
    ],
    count: 0
}

export const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<MyFile>) => {
        state.files.push(action.payload.serialize());
    },
    deleteFile: (state, action: PayloadAction<Path>) => {
        state.files = state.files.filter((data) => new MyFile(data).path() != action.payload);
    },
    editFile: (state, action: PayloadAction<[Path, string]>) => {
        let foundFile = state.files.filter((data) => new MyFile(data).path() == action.payload[0]);
        let file: MyFile = new MyFile([action.payload[0].toString(), false, '']);
        if(foundFile.length == 1){
            // file already exists, remove
            state.files = state.files.filter((data) => new MyFile(data).path() != action.payload[0]);
            file = new MyFile(foundFile[0]);
        }
        file.setContents(action.payload[1]);
        state.files.push(file.serialize());
    },
    increment: (state) => {
        state.count++;
    },
    increment_by: (state, action: PayloadAction<number>) => {
        state.count = state.count + action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addFile, deleteFile, editFile, increment, increment_by } = fileSlice.actions;

export default fileSlice.reducer;