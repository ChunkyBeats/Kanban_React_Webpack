import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];

    this.exportPublicMethods({
      getNotesByIds: this.getNotesByIds.bind(this)
    });
  }

  create(note){
    const notes = this.notes;
    note.id = uuid.v4();

    this.setState({
      notes: notes.concat(note)
    });

    return note;
  }

  update(updatedNote) {
    const notes = this.notes.map(note => {
      if(note.id === updatedNote.id) {
        /* Object.assign used to patch note data.  It mutates the target
           (first parameter). To avoid, {} is used as its target and apply
           data on it */
        return Object.assign({}, note, updatedNote);
      }
      return note;
    });
    // {notes} here is ES6 "property shorthand" and equals {notes: notes}
    this.setState({notes})
  }

  delete(id) {
    this.setState({
      notes: this.notes.filter(note => note.id !== id)
    });
  }

  getNotesByIds(ids) {
    // 1. Make sure we're operating on an array and map over IDs
    // [id, id, id, ...] -> [[Note], [], [Note], ...]
    return (ids || []).map(
      // 2. Extract matching notes
      id => this.notes.filter(note => note.id === id)
    // 3. Filter out possible empty arrays and get notes
    ).filter(a => a.length).map(a => a[0]);
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
