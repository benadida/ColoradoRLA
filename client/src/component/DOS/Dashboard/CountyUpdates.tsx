import * as React from 'react';
import { Link } from 'react-router-dom';

import * as _ from 'lodash';

import { Checkbox, Icon, InputGroup, Popover, Position } from '@blueprintjs/core';

import counties from 'corla/data/counties';

import {
    formatCountyAndBoardASMState,
    formatCountyAndBoardASMStateIndicator,
} from 'corla/format';

import { naturalSortBy } from 'corla/util';

type SortKey = 'name'
             | 'status'
             | 'submitted'
             | 'auditedDisc'
             | 'oppDisc'
             | 'disagreements'
             | 'remRound'
             | 'remTotal';

type SortOrder = 'asc' | 'desc';

interface RowData {
    id: number;
    name: string;
    status: string;
    statusIndicator: string;
    submitted: number | string;
    auditedDisc: number | string;
    oppDisc: number | string;
    disagreements: number | string;
    remRound: number | string;
    remTotal: number | string;
}

interface UpdatesProps {
    auditStarted: boolean;
    countyStatus: DOS.CountyStatuses;
}

interface UpdatesState {
    countyFilter: string;
    statusFilters: { [key: string]: boolean };
    order: SortOrder;
    sort: SortKey;
}

const linkToCountyDetail = (row: RowData) => {
    return (
        <Link to={ `/sos/county/${row.id}` }>{ row.name }</Link>
    );
};

class CountyUpdates extends React.Component<UpdatesProps, UpdatesState> {
    /*
     * When we find out about new statuses, merge them into the state, shown by
     * default.
     */
    public static getDerivedStateFromProps(props: UpdatesProps, state: UpdatesState) {
        const uniqueStatuses = _.uniq(_.map(props.countyStatus, c => {
            return formatCountyAndBoardASMState(c.asmState, c.auditBoardASMState);
        }));

        const newFilters = _.reduce(uniqueStatuses, (acc, v) => {
            if (!_.has(acc, v)) {
                acc[v] = true;
            }

            return acc;
        }, state.statusFilters);

        return { statusFilters: newFilters };
    }

    public constructor(props: UpdatesProps) {
        super(props);

        this.state = {
            countyFilter: '',
            order: 'asc',
            sort: 'name',
            statusFilters: {},
        };

        this.checkStatusFilters = this.checkStatusFilters.bind(this);
        this.uncheckStatusFilters = this.uncheckStatusFilters.bind(this);

        this.onCountyFilterChange = this.onCountyFilterChange.bind(this);
        this.reverseOrder = this.reverseOrder.bind(this);
        this.rowFilterName = this.rowFilterName.bind(this);
        this.rowFilterStatus = this.rowFilterStatus.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.sortClassForCol = this.sortClassForCol.bind(this);
        this.sortIconForCol = this.sortIconForCol.bind(this);
        this.statusFilterPopover = this.statusFilterPopover.bind(this);
    }

    public render() {
        const { auditStarted, countyStatus } = this.props;

        const countyData: RowData[] = _.map(countyStatus, (c): RowData => {
            const county = counties[c.id];
            const missedDeadline = c.asmState === 'DEADLINE_MISSED';
            const status = formatCountyAndBoardASMState(c.asmState, c.auditBoardASMState);
            const statusIndicator = formatCountyAndBoardASMStateIndicator(c.asmState, c.auditBoardASMState);

            if (!auditStarted || (auditStarted && missedDeadline)) {
                return {
                    auditedDisc: '—',
                    disagreements: '—',
                    id: c.id,
                    name: county.name,
                    oppDisc: '—',
                    remRound: '—',
                    remTotal: '—',
                    status,
                    statusIndicator: '',
                    submitted: '—',
                };
            }

            const auditedDiscrepancyCount = c.discrepancyCount
                                          ? c.discrepancyCount.audited || 0
                                          : 0;
            const unauditedDiscrepancyCount = c.discrepancyCount
                                            ? c.discrepancyCount.unaudited || 0
                                            : 0;
            const disagreementCount = c.disagreementCount || 0;

            return {
                auditedDisc: auditedDiscrepancyCount,
                disagreements: disagreementCount,
                id: c.id,
                name: county.name,
                oppDisc: unauditedDiscrepancyCount,
                remRound: c.ballotsRemainingInRound,
                remTotal: Math.max(0, c.estimatedBallotsToAudit),
                status,
                statusIndicator,
                submitted: c.auditedBallotCount || 0,
            };
        });

        const selector = (row: RowData) => {
            const countyName = row.name;
            const sortVal = row[this.state.sort];

            if (sortVal === '—') {
                // There are numeric and non-numeric columns. If the audit has not
                // started, all numeric columns will have the value '—', so it doesn't
                // matter what the _sort_ value is. If the audit has started, some
                // counties will have missed the file upload deadline. Their numeric
                // columns will display '—', but participating counties will have numeric
                // values. What we would like is for non-participating counties to appear
                // _after_ participating counties when sorting by a numeric column from
                // greatest to least. By treating '—' as -Infinity for sort purposes,
                // we guarantee it will be smaller than any participant numeric value.
                return [-Infinity, countyName];
            } else {
                return [sortVal, countyName];
            }
        };

        const filteredCountyData = _
            .chain(countyData)
            .filter(this.rowFilterName)
            .filter(this.rowFilterStatus)
            .value();

        const sortedCountyData = naturalSortBy(filteredCountyData, selector);

        if (this.state.order === 'desc') {
            _.reverse(sortedCountyData);
        }

        const countyStatusRows = _.map(filteredCountyData, (row: RowData) => {
            return (
                <tr key={ row.id }>
                    <td className={ this.sortClassForCol('name')  + ' ellipsize' }>{ linkToCountyDetail(row) }</td>
                    <td className={ this.sortClassForCol('status') + ' ellipsize' }>
                        <div className='status-indicator-group'>
                            { row.statusIndicator && <span className={ `status-indicator ${row.statusIndicator}` } /> }
                            <span className='status-indicator-text'>{ row.status }</span>
                        </div>
                    </td>
                    <td className={ this.sortClassForCol('auditedDisc') }>{ row.auditedDisc }</td>
                    <td className={ this.sortClassForCol('oppDisc') }>{ row.oppDisc }</td>
                    <td className={ this.sortClassForCol('disagreements') }>{ row.disagreements }</td>
                    <td className={ this.sortClassForCol('submitted') }>{ row.submitted }</td>
                    <td className={ this.sortClassForCol('remRound') }>{ row.remRound }</td>
                </tr>
            );
        });

        return (
            <div>
                <div className='state-dashboard-updates-preface'>
                    <div className='state-dashboard-updates-preface-description'>
                        <h3>County Updates</h3>
                        <p>
                            Click on a column name to sort by that column’s data. To
                            reverse sort, click on the column name again.
                        </p>
                    </div>
                    <div className='state-dashboard-updates-preface-search'>
                        <InputGroup leftIcon='search'
                                    type='search'
                                    placeholder='Filter by county name'
                                    value={ this.state.countyFilter }
                                    onChange={ this.onCountyFilterChange } />
                    </div>
                </div>
                <table className='pt-html-table pt-html-table-striped rla-table mt-default'>
                    <thead>
                        <tr>
                            <th className={ this.sortClassForCol('name') }
                                onClick={ this.sortBy('name') }>
                                <div className='rla-table-sortable-wrapper'>
                                    County Name
                                    { this.sortIconForCol('name') }
                                </div>
                            </th>
                            <th className={ this.sortClassForCol('status') }
                                onClick={ this.sortBy('status') }
                                style={ { width: '25%' } }>
                                <div className='rla-table-sortable-wrapper'>
                                    Status
                                    { this.sortIconForCol('status') }
                                    { this.statusFilterPopover() }
                                </div>
                            </th>
                            <th className={ this.sortClassForCol('auditedDisc') }
                                onClick={ this.sortBy('auditedDisc') }>
                                <div className='rla-table-sortable-wrapper'>
                                    Audited Discrepancies
                                    { this.sortIconForCol('auditedDisc') }
                                </div>
                            </th>
                            <th className={ this.sortClassForCol('oppDisc') }
                                onClick={ this.sortBy('oppDisc') }>
                                <div className='rla-table-sortable-wrapper'>
                                    Non-audited Discrepancies
                                    { this.sortIconForCol('oppDisc') }
                                </div>
                            </th>
                            <th className={ this.sortClassForCol('disagreements') }
                                onClick={ this.sortBy('disagreements') }>
                                <div className='rla-table-sortable-wrapper'>
                                    Disagreements
                                    { this.sortIconForCol('disagreements') }
                                </div>
                            </th>
                            <th className={ this.sortClassForCol('submitted') }
                                onClick={ this.sortBy('submitted') }>
                                <div className='rla-table-sortable-wrapper'>
                                    Submitted
                                    { this.sortIconForCol('submitted') }
                                </div>
                            </th>
                            <th className={ this.sortClassForCol('remRound') }
                                onClick={ this.sortBy('remRound') }>
                                <div className='rla-table-sortable-wrapper'>
                                    Remaining in Round
                                    { this.sortIconForCol('remRound') }
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>{ ...countyStatusRows }</tbody>
                </table>
            </div>
        );
    }

    private checkStatusFilters(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ statusFilters: _.mapValues(this.state.statusFilters, _.stubTrue) });
    }

    private uncheckStatusFilters(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ statusFilters: _.mapValues(this.state.statusFilters, _.stubFalse) });
    }

    private rowFilterName(row: RowData) {
        const name = row.name.toLowerCase();
        const s = this.state.countyFilter.toLowerCase();

        return name.includes(s);
    }

    private rowFilterStatus(row: RowData) {
        return !!_.get(this.state.statusFilters, row.status);
    }

    private sortClassForCol(col: string) {
        return col === this.state.sort ? 'is-sorted' : '';
    }

    private sortIconForCol(col: string) {
        if (col !== this.state.sort) {
            return <Icon icon='double-caret-vertical' />;
        }

        return this.state.order === 'asc'
             ? <Icon icon='symbol-triangle-down' />
             : <Icon icon='symbol-triangle-up' />;
    }

    private statusFilterPopover() {
        const createChangeHandler = (k: string) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                const newFilters = this.state.statusFilters;
                newFilters[k] = e.target.checked;
                this.setState({ statusFilters: newFilters });
            };
        };

        // The click handler on the wrapper div catches propagating clicks and
        // prevents them from bubbling up to the table header which would
        // trigger re-sorting.
        return (
            <div className='status-filter-wrapper'
                 onClick={ (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation() }>
                <Popover popoverClassName='status-filter-content'
                         targetClassName='status-filter-target'
                         position={ Position.BOTTOM }>
                    <button title='Toggle status filter controls'><Icon icon='chevron-down' /></button>
                    <div>
                        <div className='status-filter-content-header'>
                            <h3>Filter by status</h3>
                        </div>
                        <hr />
                        <div className='status-filter-content-body'>
                            { _.map(this.state.statusFilters, (v, k) => {
                                return <Checkbox onChange={ createChangeHandler(k) }
                                                 key={ k }
                                                 checked={ v }>{ k }</Checkbox>;
                            } ) }
                        </div>
                        <div className='status-filter-content-actions'>
                            <button onClick={ this.checkStatusFilters }>Check all</button>
                            <button onClick={ this.uncheckStatusFilters }>Clear all</button>
                        </div>
                    </div>
                </Popover>
            </div>
        );
    }

    private onCountyFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ countyFilter: e.target.value });
    }

    private sortBy(sort: SortKey) {
        return () => {
            if (this.state.sort === sort) {
                this.reverseOrder();
            } else {
                const order = 'asc';
                this.setState({ sort, order });
            }
        };
    }

    private reverseOrder() {
        this.setState({order: this.state.order === 'asc' ? 'desc' : 'asc'});
    }
}

export default CountyUpdates;
