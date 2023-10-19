import { connect, ConnectedProps } from 'react-redux'
import { addFile, deleteFile, editFile, increment, increment_by } from './fileslice';
import type { RootState } from './store'

const mapState = (state: RootState) => ({
    files: state.files
});

const mapDispatch = {
    addFile,
    deleteFile,
    editFile,
    increment,
    increment_by
};

export const connector = connect(mapState, mapDispatch);
export type PropsFromRedux = ConnectedProps<typeof connector>;