import * as React from 'react';
import { connect } from 'react-redux';

import counties from '../../../data/counties';

import CountyHomePage from './CountyHomePage';

import canAudit from '../../../selector/county/canAudit';


class CountyHomeContainer extends React.Component<any, any> {
    public render() {
        const {
            canAudit,
            county,
            history,
        } = this.props;

        const countyInfo = county.id ? counties[county.id] : {};
        const boardSignIn = () => history.push('/county/sign-in');
        const startAudit = () => history.push('/county/audit');

        const props = {
            boardSignIn,
            canAudit,
            countyInfo,
            startAudit,
            ...this.props,
        };

        return <CountyHomePage { ...props } />;
    }
}

const mapStateToProps = (state: any) => {
    const { county } = state;
    const { contestDefs } = county;

    return {
        canAudit: canAudit(state),
        contests: contestDefs,
        county,
    };
};

export default connect(mapStateToProps)(CountyHomeContainer);
