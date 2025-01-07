-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(50) COLLATE pg_catalog."default",
    branch_location_id integer NOT NULL,
    date_of_birth date NOT NULL,
    user_role character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'user'::character varying,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to "Group11";


-- Table: public.verification_codes

-- DROP TABLE IF EXISTS public.verification_codes;

CREATE TABLE IF NOT EXISTS public.verification_codes
(
    verification_code character varying(255) COLLATE pg_catalog."default" NOT NULL,
    user_id integer,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT verification_codes_pkey PRIMARY KEY (verification_code),
    CONSTRAINT verification_codes_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.verification_codes
    OWNER to "Group11";



-- Table: public.user_credentials

-- DROP TABLE IF EXISTS public.user_credentials;

CREATE TABLE IF NOT EXISTS public.user_credentials
(
    user_id integer NOT NULL,
    password_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT user_credentials_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_credentials
    OWNER to "Group11";

