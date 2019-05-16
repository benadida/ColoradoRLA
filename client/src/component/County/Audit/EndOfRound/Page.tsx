import * as React from 'react';

import { Card } from '@blueprintjs/core';

import finishAudit from 'corla/action/county/finishAudit';
import CountyLayout from 'corla/component/CountyLayout';
import { formatLocalDate } from 'corla/date';
import * as format from 'corla/format';

import SignOffFormContainer from './SignOffFormContainer';

interface PreviousRoundProps {
    roundNumber: number;
}

const PreviousRoundSignedOff = (props: PreviousRoundProps) => {
    const { roundNumber } = props;
    const main =
        <div>
            <h3>End of round { roundNumber }</h3>
            <Card>
               <h3>
                  You have finished auditing your portion of ballots to audit in
                  round { roundNumber }. Please wait for the other audit boards
                  to finish their portion of the audit, and for the Department
                  of State to begin the next round.
               </h3>
            </Card>
        </div>;

    return <CountyLayout main={ main } />;
};

const LastRoundComplete = () => {
    const main =
        <div>
            <h3>End of All Audit Rounds</h3>
            <Card>
                <h3>All audit rounds are complete. Please use the form below to
                certify that the county has completed the audit.</h3>
            </Card>
            <Card>
                <button className='pt-button pt-intent-primary' onClick={ finishAudit }>
                    Submit
                </button>
            </Card>
        </div>;

    return <CountyLayout main={ main } />;
};

interface PageProps {
    allRoundsComplete: boolean;
    auditBoardIndex: number;
    countyInfo: CountyInfo;
    currentRoundNumber: number;
    cvrsToAudit: JSON.CVR[];
    election: Election;
    estimatedBallotsToAudit: number;
    previousRound: Round;
}

const EndOfRoundPage = (props: PageProps) => {
    const {
        allRoundsComplete,
        auditBoardIndex,
        countyInfo,
        currentRoundNumber,
        cvrsToAudit,
        election,
        estimatedBallotsToAudit,
        previousRound,
    } = props;

    const countyName = countyInfo.name;
    const roundNumber = previousRound.number;

    if (allRoundsComplete && estimatedBallotsToAudit <= 0) {
        return <LastRoundComplete />;
    }

    const electionDate = formatLocalDate(election.date);
    const electionType = format.electionType(election.type);

    const main =
        <div>
            <h3>Audit board { auditBoardIndex + 1 }: Sign off on round { roundNumber }</h3>
            <Card>
              <h3>
                Congratulations! You have completed reporting the votes on all ballots
                randomly selected for this round of the risk-limiting audit of the
                <span> { countyName }</span> County <span> { electionDate }</span>
                <span> { electionType}</span>. After you have signed off on the
                round, you will be taken back to the main audit screen to await
                further instruction.
              </h3>
            </Card>

            <Card>
                <h3>
                    Please complete this audit round by entering your names in
                    the fields below, making the following certification, and
                    selecting Submit. By entering their name and selecting
                    Submit below, each audit board member individually certifies
                    that they:
                </h3>

                <ul>
                    <li>
                        Personally located and retrieved, or personally observed a county staff
                        member locate and retrieve, each paper ballot randomly selected for your
                        assigned portion of audit round <span>{ currentRoundNumber }</span> of
                        the <span>{ countyName }</span> County <span>{ electionDate } </span>
                        <span>{ electionType }</span>.
                    </li>
                    <li>
                        Personally examined each such randomly selected ballot;
                    </li>
                    <li>
                        Accurately entered the voter markings contained in each ballot contest
                        on each such randomly selected ballot, to the best of his or her ability;
                    </li>
                    <li>
                        Where applicable, resolved ambiguous markings, over votes and write-in
                        votes in accordance with the current version of the Secretary of State's
                        Voter Intent Guide;
                    </li>
                    <li>
                        In the case of physically duplicated ballots, if any, the Audit Board's
                        report reflects the voter markings on the paper ballot originally
                        submitted by the voter.
                    </li>
                </ul>
                <SignOffFormContainer auditBoardIndex={ auditBoardIndex } />
            </Card>
        </div>;

    return <CountyLayout main={ main } />;
};

export default EndOfRoundPage;
