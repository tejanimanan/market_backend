--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17
-- Dumped by pg_dump version 14.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: script_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.script_type_enum AS ENUM (
    'NSE',
    'BSE'
);


ALTER TYPE public.script_type_enum OWNER TO postgres;

--
-- Name: share_data_position_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.share_data_position_enum AS ENUM (
    'open',
    'close'
);


ALTER TYPE public.share_data_position_enum OWNER TO postgres;

--
-- Name: share_data_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.share_data_type_enum AS ENUM (
    'sell',
    'buy'
);


ALTER TYPE public.share_data_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: script; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.script (
    id integer NOT NULL,
    name character varying NOT NULL,
    current_rate numeric(10,2) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    high_value numeric(10,2),
    low_value numeric(10,2),
    volume bigint,
    closing_price numeric(10,2),
    create_date timestamp without time zone DEFAULT now() NOT NULL,
    updated_date timestamp without time zone DEFAULT now() NOT NULL,
    type public.script_type_enum,
    symbol character varying
);


ALTER TABLE public.script OWNER TO postgres;

--
-- Name: script_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.script_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.script_id_seq OWNER TO postgres;

--
-- Name: script_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.script_id_seq OWNED BY public.script.id;


--
-- Name: share_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.share_data (
    id integer NOT NULL,
    qty integer NOT NULL,
    type public.share_data_type_enum NOT NULL,
    price numeric(10,2),
    "position" public.share_data_position_enum DEFAULT 'open'::public.share_data_position_enum NOT NULL,
    create_date timestamp without time zone DEFAULT now() NOT NULL,
    updated_date timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    script_id integer,
    profit_loss numeric(10,2),
    "avgPrice" numeric(10,2)
);


ALTER TABLE public.share_data OWNER TO postgres;

--
-- Name: share_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.share_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.share_data_id_seq OWNER TO postgres;

--
-- Name: share_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.share_data_id_seq OWNED BY public.share_data.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    contact character varying NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    status boolean DEFAULT true NOT NULL,
    password character varying NOT NULL,
    create_date timestamp without time zone DEFAULT now() NOT NULL,
    updated_date timestamp without time zone DEFAULT now() NOT NULL,
    uid character varying
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: script id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script ALTER COLUMN id SET DEFAULT nextval('public.script_id_seq'::regclass);


--
-- Name: share_data id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.share_data ALTER COLUMN id SET DEFAULT nextval('public.share_data_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: script; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.script (id, name, current_rate, status, high_value, low_value, volume, closing_price, create_date, updated_date, type, symbol) FROM stdin;
1	eiel	400.00	t	800.00	700.00	99999	800.00	2025-06-04 12:18:10.042413	2025-06-04 12:18:10.042413	NSE	\N
2	INFOSYS LIMITED	1551.20	t	1557.30	1541.40	4548071	1543.00	2025-06-04 20:16:59.558	2025-06-04 20:16:59.558	BSE	INFY.BO
3	INFOSYS LIMITED	1551.20	t	1557.30	1541.40	4548071	1543.00	2025-06-04 20:16:59.513	2025-06-04 20:16:59.513	NSE	INFY.NS
4	TATA CONSULTANCY SERVICES LTD.	3489.00	t	3489.00	3423.25	43354	3447.10	2025-06-16 10:47:36.635	2025-06-16 10:47:36.635	BSE	TCS.BO
5	TATA CONSULTANCY SERV LT	3498.30	t	3498.70	3426.20	439874	3445.70	2025-06-16 10:47:36.621	2025-06-16 10:47:36.621	NSE	TCS.NS
6	RELIANCE INDUSTRIES LTD.	1432.80	t	1435.00	1425.00	70608	1427.65	2025-06-16 10:47:36.648	2025-06-16 10:47:36.648	BSE	RELIANCE.BO
7	RELIANCE INDUSTRIES LTD	1436.60	t	1438.20	1424.40	2190939	1427.90	2025-06-16 10:47:36.634	2025-06-16 10:47:36.634	NSE	RELIANCE.NS
8	STATE BANK OF INDIA	788.50	t	794.35	786.35	144363	792.40	2025-06-16 10:47:36.799	2025-06-16 10:47:36.799	BSE	SBIN.BO
9	STATE BANK OF INDIA	787.60	t	794.60	786.15	2031921	792.35	2025-06-16 10:47:36.722	2025-06-16 10:47:36.722	NSE	SBIN.NS
\.


--
-- Data for Name: share_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.share_data (id, qty, type, price, "position", create_date, updated_date, user_id, script_id, profit_loss, "avgPrice") FROM stdin;
1	500	buy	400.00	open	2025-06-04 13:11:01.336005	2025-06-04 13:11:01.336005	3	1	0.00	400.00
2	600	buy	400.00	open	2025-06-04 13:47:25.931675	2025-06-04 13:47:25.931675	3	1	0.00	400.00
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email, contact, role, status, password, create_date, updated_date, uid) FROM stdin;
1	manan	manan@gmail.com	9898666545	admin	t	12341234	2025-05-19 22:19:06.689306	2025-05-19 22:19:06.689306	\N
8	smitTT	smit@gmail.com	7235678678	admin	t	$2b$10$ud9nsr7PgSfNJmKH.j9SZOXcT9gkockuZG6m.qDmVRCdvdheHkC0W	2025-05-20 00:12:51.134666	2025-05-20 00:13:39.522923	\N
7	harmit	hari4444@gmail.com	9898444323	admin	t	$2b$10$oN9mbEn/eKAfiS4tzCiVd.A1AAdWG64DqiMJmdWLqQL3rnIiF9.dC	2025-05-20 00:05:28.702151	2025-05-20 00:05:28.702151	\N
2	jayy	jay@gmail.com	9898666545	user	t	9898666	2025-05-19 23:06:31.440733	2025-06-04 12:55:38.989937	S11
4	jenil123	hari@hmail.com	9898666545	company	t	12341234	2025-05-19 23:31:35.05605	2025-06-04 12:55:51.42003	S13
3	omm123	om@hmail.com	9898777656	user	t	12341234	2025-05-19 23:12:03.891815	2025-06-04 12:56:05.847333	S12
11	admin	admin@gmail.com	9898666545	admin	t	$2a$12$15rRgfdNKfmXonnTfPfoGO/hYsPRBi4/iq0l/rKwl7DYe5Dan4flO	2025-05-22 08:59:16.048925	2025-05-22 08:59:16.048925	\N
6	harmittt	hari1223@gmail.com	9898444323	user	f	12341234	2025-05-19 23:58:30.974739	2025-06-04 19:34:33.44967	S14
\.


--
-- Name: script_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.script_id_seq', 9, true);


--
-- Name: share_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.share_data_id_seq', 2, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 11, true);


--
-- Name: script PK_90683f80965555e177a0e7346af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script
    ADD CONSTRAINT "PK_90683f80965555e177a0e7346af" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: share_data PK_cbfd5f075aa01c7059abe7c93d8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.share_data
    ADD CONSTRAINT "PK_cbfd5f075aa01c7059abe7c93d8" PRIMARY KEY (id);


--
-- Name: script UQ_dc536fc4d2dce67c7290c3d77b5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script
    ADD CONSTRAINT "UQ_dc536fc4d2dce67c7290c3d77b5" UNIQUE (symbol);


--
-- Name: user UQ_df955cae05f17b2bcf5045cc021; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_df955cae05f17b2bcf5045cc021" UNIQUE (uid);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: share_data FK_2c433601d8bb607140f0609c4d4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.share_data
    ADD CONSTRAINT "FK_2c433601d8bb607140f0609c4d4" FOREIGN KEY (script_id) REFERENCES public.script(id) ON DELETE CASCADE;


--
-- Name: share_data FK_8d93f038300957daf8f384a509b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.share_data
    ADD CONSTRAINT "FK_8d93f038300957daf8f384a509b" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

