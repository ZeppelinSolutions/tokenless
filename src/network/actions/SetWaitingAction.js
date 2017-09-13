export const SET_WAITING = 'network/SET_WAITING';

export function setWaiting(isWaiting) {
  console.log('setWaiting()', isWaiting);
  return function(dispatch, getState) {
    dispatch({
      type: SET_WAITING,
      payload: isWaiting
    });
  };
}
