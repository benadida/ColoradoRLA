type Dashboard = 'sos' | 'county';

type ElectionType = 'coordinated'
                  | 'primary'
                  | 'general'
                  | 'recall';

interface AppState {
    loginChallenge: any;
    dashboard?: Dashboard;
    county?: CountyState;
    sos?: DosState;
}

interface CountyState {
    acvrs: any;
    asm: any;
    auditBoard: any;
    contests: any;
    contestDefs?: any;
    currentBallot?: any;
    currentRound?: any;
    cvrsToAudit?: any;
    fileName?: any;  // TODO: remove
    hash?: any;  // TODO: remove
    uploadingBallotManifest?: boolean;
    uploadingCvrExport?: boolean;
}

interface DosState {
    asm: any;
    auditStage: any;
    auditedContests: any;
    contests?: any;
    contestsForAudit?: any;
    countyStatus: any;
    seed?: any;
}

interface AuditBoardMember {
    firstName: string;
    lastName: string;
    party: string;
}

type AuditBoard = AuditBoardMember[];

interface AuditBoardMemberJson {
    first_name: string;
    last_name: string;
    political_party: string;
}

type AuditBoardJson = AuditBoardMemberJson[];

interface RiskLimitJson {
    risk_limit: number;
}

interface Elector {
    firstName: string;
    lastName: string;
}

interface ElectorJson {
    first_name: string;
    last_name: string;
}

interface Acvr {
    [contestId: number]: AcvrContest;
}

interface AcvrContest {
    choices: AcvrChoices;
    comments: string;
    noConsensus: boolean;
}

interface AcvrChoices {
    [contestChoice: string]: boolean;
}

interface ContestInfoJson {
    choices: string[];
    contest: number;
    consensus: string;
}

interface AcvrJson {
    audit_cvr: CvrJson;
    cvr_id: number;
}

interface Cvr {
    ballotType: any;
    batchId: any;
    contestInfo: any;
    countyId: any;
    cvrNumber: any;
    id: any;
    imprintedId: any;
    recordId: any;
    recordType: any;
    scannerId: any;
}

interface CvrJson {
    ballot_type: string;
    batch_id: string;
    contest_info: ContestInfoJson[];
    county_id: number;
    cvr_number: number;
    id: number;
    imprinted_id: string;
    record_id: string;
    record_type: string;
    scanner_id: string;
    timestamp: Date;
}

interface UploadFileOkJson {
    approximate_record_count: number;
    county_id: number;
    file_id: number;
    hash: string;
    hash_status: string;
    status: string;
    size: number;
    timestamp: string;
}

type UploadBallotManifestOkJson = UploadFileOkJson;

type UploadCvrExportOkJson = UploadFileOkJson;

interface FetchCountyAsmStateOkJson {
    current_state: CountyAsmState;
    enabled_ui_events: string[];
}

interface FetchDosAsmStateOkJson {
    current_state: DosAsmState;
    enabled_ui_events: string[];
}

interface CountyAsm {
    currentState: CountyAsmState;
    enabledUiEvents: string[];
}

interface DosAsm {
    currentState: DosAsmState;
    enabledUiEvents: string[];
}

type AuditBoardAsmState
    = 'AUDIT_INITIAL_STATE'
    | 'WAITING_FOR_ROUND_START'
    | 'WAITING_FOR_ROUND_START_NO_AUDIT_BOARD'
    | 'ROUND_IN_PROGRESS'
    | 'ROUND_IN_PROGRESS_NO_AUDIT_BOARD'
    | 'WAITING_FOR_ROUND_SIGN_OFF'
    | 'WAITING_FOR_ROUND_SIGN_OFF_NO_AUDIT_BOARD'
    | 'AUDIT_COMPLETE'
    | 'UNABLE_TO_AUDIT'
    | 'AUDIT_ABORTED';

type CountyAsmState
    = 'COUNTY_INITIAL_STATE'
    | 'COUNTY_AUTHENTICATED'
    | 'BALLOT_MANIFEST_OK'
    | 'CVRS_OK'
    | 'BALLOT_MANIFEST_AND_CVRS_OK'
    | 'COUNTY_AUDIT_UNDERWAY'
    | 'COUNTY_AUDIT_COMPLETE'
    | 'DEADLINE_MISSED';

type DosAsmState
    = 'DOS_INITIAL_STATE'
    | 'DOS_AUTHENTICATED'
    | 'RISK_LIMITS_SET'
    | 'CONTESTS_TO_AUDIT_IDENTIFIED'
    | 'DATA_TO_AUDIT_PUBLISHED'
    | 'RANDOM_SEED_PUBLISHED'
    | 'BALLOT_ORDER_DEFINED'
    | 'AUDIT_READY_TO_START'
    | 'DOS_AUDIT_ONGOING'
    | 'DOS_ROUND_COMPLETE'
    | 'DOS_AUDIT_COMPLETE'
    | 'AUDIT_RESULTS_PUBLISHED';
