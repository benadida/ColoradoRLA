import * as React from 'react';
import { Link } from 'react-router-dom';

import * as _ from 'lodash';

import CountyNav from '../Nav';

import FileUploadContainer from './FileUploadContainer';


const Main = (props: any) => {
    const { auditButtonDisabled, boardSignIn, name, startAudit } = props;

    return (
        <div className='county-main pt-card'>
            <h1>Hello, { name } County!</h1>
            <div>
                <div>
                    Please upload your Ballot Manifest and Cast Vote Records.
                </div>
                <FileUploadContainer />
                <button
                    className='pt-button pt-intent-primary'
                    onClick={ boardSignIn }>
                    <span className='pt-icon-standard pt-icon-people' />
                    <span> </span>
                    Audit Board Sign-In
                </button>
                <button
                    disabled={ auditButtonDisabled }
                    className='pt-button pt-intent-primary'
                    onClick={ startAudit }>
                    <span className='pt-icon-standard pt-icon-eye-open' />
                    <span> </span>
                    Start Audit
                </button>
            </div>
        </div>
    );
};

const ContestInfoTableRow = ({ choice }: any) => (
    <tr>
        <td>{ choice.name }</td>
        <td>{ choice.description }</td>
    </tr>
);

const ContestInfoTable = ({ contest }: any) => {
    const body = _.map(contest.choices, (c: any) => {
        return <ContestInfoTableRow key={ c.name } choice={ c } />;
    });

    return (
        <div className='pt-card'>
            <span>{ contest.name }</span>
            <table className='pt-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    { body }
                </tbody>
            </table>
        </div>
    );
};

const ContestInfo = ({ contests }: any): any => {
    const contestTables = _.map(contests, (c: any) => {
        if (!c) {
            return <div />;
        }

        return <ContestInfoTable key={ c.name } contest={ c } />;
    });

    return (
        <div className='contest-info pt-card'>
            <h3>Contest info</h3>
            <div>
                { contestTables }
            </div>
        </div>
    );
};

const CountyInfo = ({ county, info }: any) => {
    const { ballotsToAudit } = county;
    const unauditedBallotCount = ballotsToAudit ? ballotsToAudit.length : '';

    const rows = [
        ['County:', info.name],
        ['Status:', county.status],
        ['# Ballots to audit:', unauditedBallotCount],
        ['# Ballots audited:', county.auditedBallotCount],
        ['# Disagreements:', county.disagreementCount],
        ['# Discrepancies:', county.discrepancyCount],

    ].map(([k, v]: any) => (
        <tr key={ k }>
            <td><strong>{ k }</strong></td>
            <td>{ v }</td>
        </tr>
    ));

    return (
        <div className='county-info pt-card'>
            <h3>County info</h3>
            <div className='pt-card'>
                <table className='pt-table pt-condensed'>
                    <tbody>{ rows }</tbody>
                </table>
            </div>
        </div>
    );
};

const Info = ({ info, contests, county }: any) => (
    <div className='info pt-card'>
        <CountyInfo county={ county } info={ info } />
        <ContestInfo contests={ contests } />
    </div>
);

const CountyHomePage = (props: any) => {
    const {
        boardSignIn,
        canAudit,
        contests,
        county,
        countyInfo,
        countyDashboardRefresh,
        startAudit,
    } = props;
    const {
        ballots,
        ballotManifestHash,
        cvrExportHash,
        startTimestamp,
        status,
    } = county;

    const info = { auditDate: startTimestamp };

    const auditButtonDisabled = !canAudit;

    return (
        <div className='county-root'>
            <CountyNav />
            <div>
                <Main boardSignIn={ boardSignIn }
                      auditButtonDisabled={ auditButtonDisabled }
                      name={ countyInfo.name }
                      startAudit={ startAudit } />
                <Info info={ countyInfo }
                      contests={ contests }
                      county={ county } />
            </div>
        </div>
    );
};

export default CountyHomePage;
