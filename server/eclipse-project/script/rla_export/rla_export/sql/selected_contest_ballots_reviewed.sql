-- For each contest under audit, and for each ballot that has been reviewed so far, original cvr info, audit board interp info and discrepancy type. 
-- documentation needed for review_order (order of physical ballot card review, obtained by deleting dupes from the random sequence and then ordering, starting at 1). 

SELECT 
cty.name AS county_name,	
ctt.name AS contest_name,
cvr_s.scanner_id,
cvr_s.batch_id,
cvr_s.sequence_number + 1 as position_in_batch,
cvr_s.imprinted_id,
cvr_s.ballot_type,
cci_s.choices AS voting_computer_interpretation_of_voter_choice,
cci_a.choices AS audit_board_interpretation_of_voter_choice,
cci_a.consensus AS did_audit_board_agree,
cci_a.comment AS audit_board_comment,
cai.index + 1 AS review_index, 
cvr_a.timestamp
 FROM cvr_audit_info AS cai
 LEFT JOIN cast_vote_record AS cvr_a
   ON cai.acvr_id = cvr_a.id
 LEFT JOIN cast_vote_record AS cvr_s
   ON cai.cvr_id = cvr_s.id
 LEFT JOIN cvr_contest_info AS cci_s
   ON cai.cvr_id = cci_s.cvr_id
 LEFT JOIN cvr_contest_info AS cci_a
   ON cai.acvr_id = cci_a.cvr_id
     AND cci_a.contest_id = cci_s.contest_id
 LEFT JOIN county AS cty
   ON cai.dashboard_id = cty.id
 LEFT JOIN contest AS ctt
   ON cci_s.contest_id = ctt.id
 ORDER BY county_name, contest_name, review_index
;
