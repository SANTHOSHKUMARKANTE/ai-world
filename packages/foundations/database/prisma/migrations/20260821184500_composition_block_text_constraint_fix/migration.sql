-- Replace the invalid chr(0) expression. PostgreSQL text values already reject
-- embedded null bytes before a table constraint is evaluated.
ALTER TABLE "composition_blocks"
DROP CONSTRAINT "composition_blocks_text_content_check";

ALTER TABLE "composition_blocks"
ADD CONSTRAINT "composition_blocks_text_content_check"
CHECK (
    char_length("text_content") BETWEEN 1 AND 10000
    AND btrim("text_content") <> ''
);
