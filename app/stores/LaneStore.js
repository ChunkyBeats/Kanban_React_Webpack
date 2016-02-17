import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';

class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    this.lanes = [];
  }

  create(lane) {
    const lanes = this.lanes;

    lane.id = uuid.v4();
    lane.notes = lane.notes || [];

    this.setState({
      lanes: lanes.concat(lane)
    });
  }

  attachToLane(params) {
    // Object being sent from Lane.jsx is an object {laneId, noteId},
    // Need to use those props from params.  Was including laneId and noteId
    //  in an array under laneId before, still unsure why
    const lanes = this.lanes.map(lane => {
      if(lane.id === params.laneId) {
        if(lane.notes.includes(params.noteId)) {
          console.warn('Already attached note to lane', lanes);
        }
        else {
          lane.notes.push(params.noteId);
        }
      }
      return lane;
    });

    this.setState({lanes});
  }

  detachFromLane({laneId, noteId}) {
    const lanes = this.lanes.map(lane => {
      if(lane.id === laneId) {
        lane.notes = lane.notes.filter(note => note !== noteId);
      }

      return lane;
    });

    this.setState({lanes});
  }
}

export default alt.createStore(LaneStore, 'LaneStore');