import * as _ from 'lodash';


function parse(data: any) {
    return {
        currentState: data.current_state,
        enabledUiEvents: data.enabled_ui_events,
    };
}


export default (state: any, action: any) => {
    const nextState = { ...state };

    nextState.sos.asm = parse(action.data);

    return nextState;
};
