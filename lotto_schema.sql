drop table if exists ticket;
drop table if exists round;

CREATE TABLE round (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	number integer NOT NULL,
    started_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
	ended_at TIMESTAMP WITHOUT TIME ZONE,
	drawn_at TIMESTAMP WITHOUT TIME ZONE,
	drawn_numbers integer[]
);

CREATE TABLE ticket (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL,
    document_number VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    numbers integer[],
    CONSTRAINT fk_round FOREIGN KEY (round_id) REFERENCES round(id) ON DELETE CASCADE
);