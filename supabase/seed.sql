--/*================================ auth.users ==============================*/
INSERT INTO auth.users(
	instance_id,
	id,
	aud,
	ROLE,
	email,
	encrypted_password,
	raw_app_meta_data,
	raw_user_meta_data,
	email_confirmed_at,
	created_at)
VALUES (
	'00000000-0000-0000-0000-000000000000',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13',
	'authenticated',
	'authenticated',
	'rbkayz@gmail.com',
	'$2a$10$lUEsorMExHGmQthVF6SlpOYmqnV1GodB2NU6V2Z3Az/XpHixbyCJW',
	'{"provider":"email","providers":["email"]}',
	'{}',
	timezone(
		'utc' ::text, now()),
	timezone(
		'utc' ::text, now())),
(
	'00000000-0000-0000-0000-000000000000',
	'8063fe56-e8d2-4d98-bedd-0db693161ca2',
	'authenticated',
	'authenticated',
	'alt.1@test.com',
	'$2a$10$bZ5tqo7YCXSGiObqcvAD9uQ.PS8bRDcelGBlP3b1RiTtTCPdeRO8y',
	'{"provider":"email","providers":["email"]}',
	'{}',
	timezone(
		'utc' ::text, now()),
	timezone(
		'utc' ::text, now()));

INSERT INTO auth.identities(
	id,
	user_id,
	identity_data,
	provider,
	created_at,
	updated_at)
VALUES (
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13',
	'{"sub": "3ef075b6-2ae1-40c2-af3f-23c99d345a13"}',
	'email',
	timezone(
		'utc' ::text, now()),
	timezone(
		'utc' ::text, now())),
(
	'8063fe56-e8d2-4d98-bedd-0db693161ca2',
	'8063fe56-e8d2-4d98-bedd-0db693161ca2',
	'{"sub": "8063fe56-e8d2-4d98-bedd-0db693161ca2"}',
	'email',
	timezone(
		'utc' ::text, now()),
	timezone(
		'utc' ::text, now()));

--/*================================ tbl_org ==============================*/
INSERT INTO tbl_org(
	org_id,
	user_id,
	ROLE,
	org_name)
VALUES (
	'f5cb38ed-aa4f-41e3-a9a5-a3941f6471f7',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13',
	'OWNER',
	'Organization 1'),
(
	'22fd05ae-fedd-4bfd-9f63-9831b6d34d32',
	'8063fe56-e8d2-4d98-bedd-0db693161ca2',
	'OWNER',
	'Organization 2');

--/*================================ tbl_documents ==============================*/
INSERT INTO tbl_documents(
	document_id,
	name,
	source_path,
	source_type,
	is_enabled,
	org_id,
	created_by)
VALUES (
	'zpgh-cabc',
	'File Name 1',
	'C://Desktop/abc.pdf',
	'LOCAL',
	'TRUE',
	'f5cb38ed-aa4f-41e3-a9a5-a3941f6471f7',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'mphe-albd',
	'File Name 2',
	'file/drive/123.pdf',
	'GDRIVE',
	'FALSE',
	'f5cb38ed-aa4f-41e3-a9a5-a3941f6471f7',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'mphe-psrh',
	'File Name 3',
	'file/drive/abc.pdf',
	'GDRIVE',
	'TRUE',
	'22fd05ae-fedd-4bfd-9f63-9831b6d34d32',
	'8063fe56-e8d2-4d98-bedd-0db693161ca2');

--/*================================ tbl_documents ==============================*/
INSERT INTO tbl_links(
	name,
	is_active,
	document_id,
	created_by)
VALUES (
	'Test Link 1',
	TRUE,
	'zpgh-cabc',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'Test Link 2',
	TRUE,
	'zpgh-cabc',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'Test Link 1',
	TRUE,
	'zpgh-cabc',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'Test Link 3',
	TRUE,
	'zpgh-cabc',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'Test Link 4',
	FALSE,
	'zpgh-cabc',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'Test Link 5',
	FALSE,
	'zpgh-cabc',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'Test Link 101',
	TRUE,
	'mphe-albd',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'Test Link 102',
	FALSE,
	'mphe-albd',
	'3ef075b6-2ae1-40c2-af3f-23c99d345a13'),
(
	'Test Link AB',
	TRUE,
	'mphe-psrh',
	'8063fe56-e8d2-4d98-bedd-0db693161ca2');

