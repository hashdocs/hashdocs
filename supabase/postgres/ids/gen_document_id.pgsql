DROP FUNCTION IF EXISTS gen_document_id();

CREATE OR REPLACE FUNCTION gen_document_id(size int DEFAULT 8, alphabet text DEFAULT 'abcdefghijklmnopqrstuvwxyz')
	RETURNS text
	LANGUAGE plpgsql
	VOLATILE
	AS $$
DECLARE
	idBuilder text := '';
	counter int := 0;
	bytes bytea;
	alphabetIndex int;
	alphabetArray text[];
	alphabetLength int;
	mask int;
	step int;
BEGIN
	alphabetArray := regexp_split_to_array(alphabet, '');
	alphabetLength := array_length(alphabetArray, 1);
	mask :=(2 << cast(floor(log(alphabetLength - 1) / log(2)) AS int)) - 1;
	step := cast(ceil(1.6 * mask * size / alphabetLength) AS int);
	while TRUE LOOP
		bytes := gen_random_bytes(step);
		while counter < step LOOP
			alphabetIndex :=(get_byte(bytes, counter) & mask) + 1;
			IF alphabetIndex <= alphabetLength THEN
				idBuilder := idBuilder || alphabetArray[alphabetIndex];
				IF length(idBuilder) = size THEN
					RETURN LEFT(idBuilder,4) || '-' || RIGHT(idBuilder,4);
				END IF;
			END IF;
			counter := counter + 1;
		END LOOP;
		counter := 0;
	END LOOP;

	RAISE EXCEPTION 'Unexpected error: could not generate document_id';
END
$$;

