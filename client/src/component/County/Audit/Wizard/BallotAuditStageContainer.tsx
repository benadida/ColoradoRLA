import * as React from 'react';
import { connect } from 'react-redux';

import BallotAuditStage from './BallotAuditStage';

import action from 'corla/action';

import ballotNotFound from 'corla/action/county/ballotNotFound';

import currentBallotNumber from 'corla/selector/county/currentBallotNumber';
import totalBallotsForBoard from 'corla/selector/county/totalBallotsForBoard';


interface StateProps {
    auditBoardIndex: number;
    comment?: string;
    currentBallot?: County.CurrentBallot;
    isReAuditing: boolean;
    updateBallotMarks: OnClick;
}

interface OwnProps {
    countyState: County.AppState;
    currentBallotNumber?: number;
    reviewingBallotId?: number;
    totalBallotsForBoard?: number;
    nextStage: OnClick;
    prevStage: OnClick;
}

type Props = StateProps & OwnProps;

const Component = (props: Props) => <BallotAuditStage { ...props } />;

const select = (countyState: County.AppState): StateProps => {
    const { currentBallot } = countyState;

    const comment = countyState.finalReview.comment;

    const updateBallotMarks = (data: any) =>
        action('UPDATE_ACVR_FORM', data);

    return {
        auditBoardIndex: countyState.auditBoardIndex || 0,
        comment,
        currentBallot,
        isReAuditing: !!comment,
        updateBallotMarks,
    };
};

export default connect(select)(Component);
