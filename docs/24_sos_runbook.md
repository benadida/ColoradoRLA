# Colorado Risk Limiting Audit 
# Secretary of State Run Book 

## Introduction

This Run Book guides State election administrators in Colorado who
will be implementing a Risk Limiting Audit (RLA). There is a separate
book for County election administrators.

The RLA Tool, developed by Free & Fair for the Colorado Department of
State for use in elections in November 2017 and later, supports
Risk-Limiting Audits as required by Colorado statute and as described
in the
[Colorado Secretary of State's Rule 25](http://www.sos.state.co.us/pubs/rule_making/CurrentRules/8CCR1505-1/ElectionRules.pdf) for
elections.

The RLA Tool helps the Colorado Secretary of State fulfill the
requirements of Rule 25.2.2 and Rule 25.2.3.  Using the RLA Tool,
Secretary of State can enter the risk limit, the publicly-generated
random seed, and the contests that drive the audit process. As
Counties upload ballot manifests and CVR files, the RLA Tool allows
the Secretary of State to monitor progress. The Secretary of State can
use the tool to identify contests that should go to a full hand
count. The RLA Tool performs the calculations required by Rule 25,
such as choosing random samples of ballots for audit and determining
actual risk levels. While audits are ongoing, the Secretary of State
can monitor the progress of the individual County audit boards.

The RLA Tool also exports reports and files for use in the Audit
Center, a website required by Rule 25 to disseminate audit-related
information to the public.

This version of the RLA Tool requires that the contests driving the
audit round sizes and risk level calculations must be single-County
contests.

This version of the RLA Tool requires Cast Vote Record and Ballot
Manifest files in the format exported from the Dominion Democracy
Suite.
 
### Launching and Logging In

Department of State users must log in to the RLA Tool by pointing
their browser to the URL designated by the Department of State. 
County users can use the same URL.

![Login](./screenshots/100_login_screen_1.png)

Successful entry of username and password will lead to 
a two-factor authentication grid challenge.

![Grid Challenge](./screenshots/101_login_screen_2.png)

The RLA Tool will direct users to the Department of State home
page. At the start of the audit process, this page will contain no
information. Note the logout button, in the upper right of this (and
every) page.

![Logout Button](./screenshots/LogoutButton.png)

![Secretary of State Home Screenshot](./screenshots/2-sos_initial_landing_page.png)

### Navigation

Note the navigation menu in the upper left corner.

![Secretary of State Navigation Screenshot](./screenshots/2-sos_nav.png)

### Audit Status

Text indicating the status of the audit is near the top of the page. 

![Audit Status Message Screenshot](./screenshots/2-sos_audit_status.png)

### 25.2.2 (A), Entering the Risk Limit

The Secretary of State will enter date the election will take place,
the type of election, and the Risk Limit. Note that once these
selections are entered they cannot be modified. To continue, click the
"Save & Next" button.

![State Risk Limit Entry Screenshot](./screenshots/5-sos_define_audit_save_and_next1.png)

<!-- The County Update table allows the Secretary of State to see which -->
<!-- Counties have uploaded which files. -->

<!-- ![County Uploads Screenshot]() -->

<!-- Note the change in the status message now that the Risk Limit has been -->
<!-- entered. -->

The County Update table allows the Secretary of State to see which
Counties have uploaded which files. 

![Waiting For Counties to Upload Contest Data](./screenshots/6-comparison_risk_limit_now_set.png)

When the Counties have uploaded the necessary files, the Secretary of
State can proceed to define the audit—by choosing contests and setting
the risk limit—using the dropdown menu on the upper left.

![Define the Audit Button](./screenshots/3-sos_define_audit_button_in_dropdown.png)

### 25.2.2 (I) Selecting Contests

The Secretary of State will then select the contests that will drive
the sample size and stop/go decisions for each round.  Rule Rule 25
calls these "contests to be audited". Note that in the current version
of the RLA Tool, each contest is considered to be within a single
County.  Calculations of audit round sizes and risk levels are based
on single County contests.

![State Contest Selection Screenshot](./screenshots/8-sos_selects_contest_reason_why_dropdown.png)

### 25.2.2 (H), Entering the Random Seed

The Secretary of State enters the random seed. Note that once the seed
is entered, it cannot be changed.

![State Random Seed Entry Screenshot](./screenshots/12-enter_random_seed_about_to_click.png)

If the random seed is not at least 20 digits long, the system shows a
red error message. User will have to click the "Back" button and try
again.

![State Random Seed Entry Incorrect](./screenshots/13-entered_incorrect_random_seed1.png)

Once the random seed is entered the Secretary of State can launch the
audit by clicking the "Launch Audit" button.

![Audit Has Begun](./screenshots/15-the_audit_is_launched.png)

### Audit Rounds

Once the audit is launched, the first round of the audit begins. In
each round, the tool shows each County a list of ballot cards to be
reviewed. As the County Audit Boards review ballot cards and enter
interpretations, the Secretary of State can see the number of ballot
cards reviewed so far, the number of ballot cards with discrepancies
(between audit board interpretations and the CVR file), the number of
ballot cards on which the audit board disagreed, and the number of
ballot cards yet to be reviewed in the current round in the County
Update table.

The RLA Tool permits the Secretary of State to see the progress of
audit for selected contests and the estimated number of ballot cards
remaining to be audited to meet the risk limit.

![Secretary of State Mid-Audit Screen](./screenshots/16-audit_status.png)

<!--- The RLA Tool also allows the Secretary of State to designate a contest
for hand counting at any time.
![Full Hand Count Screen](./screenshots/9-sos_chooses_full_hand_count.png)
--->

At the end of each round the Secretary of State can launch the next
round by clicking the "Start Round" button. This button will work only
if each and every County Audit Board has not only finished the audit
round, but also signed off on the audit round.

![Launch New Round Screenshot](./screenshots/sos_launch_round.png)

### Concluding the Audit

Once the final round concludes, the audit board are congratulated and
asked to sign an audit report for the county. County administrators
can download that report in Microsoft Excel format.

<!--- ### Exports
--->