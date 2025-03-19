OG

DECLARE
    result jsonb;
    update_count integer := 0;
    insert_count integer := 0;
    email_update_count integer := 0;
BEGIN
    RAISE NOTICE 'Starting update with board_id_param: %, user_id_param: % and data: %', board_id_param, user_id_param, columns_data;

    -- Validate inputs
    IF board_id_param IS NULL THEN
        RAISE EXCEPTION 'board_id_param cannot be null';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM boards
        WHERE id = board_id_param AND user_id = user_id_param
    ) THEN
        RAISE EXCEPTION 'Board with id % does not belong to user with id %', board_id_param, user_id_param;
    END IF;

    -- Update columns
    BEGIN
        WITH updated_rows AS (
            UPDATE board_columns bc
            SET
                type = COALESCE(i.type, bc.type),
                settings = COALESCE(i.settings, '{}'::jsonb),
                position = COALESCE(i.position, bc.position),
                title = COALESCE(i.title, bc.title),
                updated_at = CURRENT_TIMESTAMP
            FROM jsonb_populate_recordset(NULL::board_columns, columns_data) i
            WHERE bc.id = i.id
            RETURNING bc.*
        )
        SELECT COUNT(*) INTO update_count FROM updated_rows;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Error updating columns: %', SQLERRM;
            RAISE;
    END;

    -- Insert new columns
    BEGIN
        WITH inserted_rows AS (
            INSERT INTO board_columns (board_id, type, settings, position, title)
            SELECT
                board_id_param,
                i.type,
                COALESCE(i.settings, '{}'::jsonb),
                i.position,
                i.title
            FROM jsonb_populate_recordset(NULL::board_columns, columns_data) i
            WHERE NOT EXISTS (
                SELECT 1
                FROM board_columns bc
                WHERE bc.id = i.id
            )
            RETURNING *
        )
        SELECT COUNT(*) INTO insert_count FROM inserted_rows;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Error inserting columns: %', SQLERRM;
            RAISE;
    END;

    -- Update email positions
    BEGIN
        UPDATE board_emails be
        SET column_id = ci.column_id,
            updated_at = CURRENT_TIMESTAMP
        FROM (
            SELECT
                bc.id AS column_id,
                col->'itemIds' AS item_ids
            FROM jsonb_array_elements(columns_data) AS col
            JOIN board_columns bc ON bc.id = (col->>'id')::integer
            WHERE bc.board_id = board_id_param
        ) ci
        WHERE be.id::text = ANY(SELECT jsonb_array_elements_text(item_ids)::text)
          AND be.board_id = board_id_param;

        SELECT COUNT(*) INTO email_update_count
        FROM board_emails
        WHERE board_id = board_id_param
        AND updated_at >= NOW() - INTERVAL '1 minute';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Error updating emails: %', SQLERRM;
            RAISE;
    END;

    -- Final result
    SELECT COALESCE(jsonb_agg(to_jsonb(bc)), '[]'::jsonb)
    INTO result
    FROM board_columns bc
    WHERE bc.board_id = board_id_param;

    RETURN jsonb_build_object(
        'board_id', board_id_param,
        'updated_count', update_count,
        'inserted_count', insert_count,
        'email_update_count', email_update_count,
        'updated_columns', result
    );
END;
