-- ============================================================
-- Seed data — run after schema.sql
-- ============================================================

-- ANNOUNCEMENTS
insert into announcements (title, message, urgency, active) values
('Home Game Tomorrow', 'Varsity hosts Mount Tahoma at Sehmel Homestead Park, 4:00 PM. Come out and support the Tides!', 'info', true);

-- VARSITY GAMES
insert into games (id, team, date, time, opponent, location, venue, type, score_us, score_them, result, highlights) values
('v1', 'varsity', '2026-03-16', '4:00 PM', 'Rogers', 'away', 'Rogers HS', 'game', 2, 5, 'L', null),
('v2', 'varsity', '2026-03-19', '4:00 PM', 'North Thurston', 'home', 'Sehmel Homestead Park', 'game', 15, 1, 'W', 'Cuda dominant on the mound. Payne 3-for-4 with 2 RBI.'),
('v3', 'varsity', '2026-03-20', '4:00 PM', 'Lakes', 'home', 'Sehmel Homestead Park', 'game', 1, 3, 'L', null),
('v4', 'varsity', '2026-03-21', '12:00 PM', 'Kelso', 'home', 'Sehmel Homestead Park', 'game', 0, 1, 'L', null),
('v5', 'varsity', '2026-03-23', '12:00 PM', 'River Ridge', 'away', 'River Ridge HS', 'game', 16, 3, 'W', null),
('v6', 'varsity', '2026-03-25', '4:00 PM', 'Bellarmine Prep', 'home', 'Sehmel Homestead Park', 'game', 8, 0, 'W', 'Bockhorn complete game shutout, 9 K''s. Sleeter 2-run double in the 3rd.'),
('v7', 'varsity', '2026-03-27', '4:00 PM', 'Bellarmine Prep', 'away', 'Bellarmine Prep', 'game', 3, 1, 'W', null),
('v8', 'varsity', '2026-03-28', '1:00 PM', 'West Seattle', 'home', 'Sehmel Homestead Park', 'game', 5, 7, 'L', null),
('v9', 'varsity', '2026-03-31', '4:00 PM', 'Silas', 'home', 'Sehmel Homestead Park', 'game', 5, 0, 'W', null),
('v10', 'varsity', '2026-04-01', '4:00 PM', 'Silas', 'away', 'Silas HS', 'game', 3, 9, 'L', null),
('v11', 'varsity', '2026-04-06', '12:00 PM', 'Lincoln', 'away', 'Lincoln HS', 'game', 16, 0, 'W', null),
('v12', 'varsity', '2026-04-07', '4:00 PM', 'Lincoln', 'home', 'Sehmel Homestead Park', 'game', 14, 0, 'W', null),
('v13', 'varsity', '2026-04-11', '1:00 PM', 'Curtis', 'neutral', 'Cheney Stadium', 'game', 3, 5, 'L', null),
('v14', 'varsity', '2026-04-13', '4:00 PM', 'Mount Tahoma', 'away', 'Mount Tahoma HS', 'game', 27, 1, 'W', 'Season-high 27 runs. Every starter reached base. Riley 4-for-5 with a grand slam.'),
('v15', 'varsity', '2026-04-15', '4:00 PM', 'Mount Tahoma', 'home', 'Sehmel Homestead Park', 'game', null, null, null, null),
('v16', 'varsity', '2026-04-21', '4:00 PM', 'Central Kitsap', 'home', 'Sehmel Homestead Park', 'game', null, null, null, null),
('v17', 'varsity', '2026-04-22', '4:00 PM', 'Central Kitsap', 'away', 'Central Kitsap HS', 'game', null, null, null, null),
('v18', 'varsity', '2026-04-28', '4:00 PM', 'Peninsula', 'home', 'Sehmel Homestead Park', 'game', null, null, null, null),
('v19', 'varsity', '2026-04-29', '4:00 PM', 'Capital', 'home', 'Sehmel Homestead Park', 'game', null, null, null, null),
('v20', 'varsity', '2026-05-04', '4:00 PM', 'Timberline', 'away', 'Timberline HS', 'game', null, null, null, null);

-- JV GAMES
insert into games (id, team, date, time, opponent, location, venue, type, score_us, score_them, result) values
('j1', 'jv', '2026-03-16', '3:30 PM', 'Rogers', 'away', 'PRC', 'game', 3, 2, 'W'),
('j2', 'jv', '2026-03-19', '4:00 PM', 'North Thurston', 'away', 'North Thurston HS', 'game', 11, 0, 'W'),
('j3', 'jv', '2026-03-23', '4:00 PM', 'Bellarmine Prep', 'away', 'Bellarmine HS', 'game', 6, 0, 'W'),
('j4', 'jv', '2026-03-25', '4:00 PM', 'Bellarmine Prep', 'home', 'GHHS', 'game', 11, 1, 'W'),
('j5', 'jv', '2026-03-31', '4:00 PM', 'Silas', 'away', 'Silas HS', 'game', 14, 3, 'W'),
('j6', 'jv', '2026-04-01', '4:00 PM', 'Silas', 'home', 'GHHS', 'game', 6, 5, 'W'),
('j7', 'jv', '2026-04-06', '4:00 PM', 'Lincoln', 'home', 'GHHS', 'game', 20, 2, 'W'),
('j8', 'jv', '2026-04-07', '4:00 PM', 'Lincoln', 'away', 'Lincoln HS', 'game', 20, 0, 'W'),
('j9', 'jv', '2026-04-10', '4:00 PM', 'Tahoma', 'away', 'Summit Park', 'game', 6, 5, 'W'),
('j10', 'jv', '2026-04-13', '4:00 PM', 'Mount Tahoma', 'home', 'GHHS', 'game', 10, 0, 'W'),
('j11', 'jv', '2026-04-15', '4:00 PM', 'Peninsula (PHS)', 'home', 'GHHS', 'game', null, null, null),
('j12', 'jv', '2026-04-17', '4:00 PM', 'Peninsula (PHS)', 'away', 'Peninsula HS', 'game', null, null, null),
('j13', 'jv', '2026-04-21', '4:00 PM', 'Central Kitsap', 'home', 'GHHS', 'game', null, null, null),
('j14', 'jv', '2026-04-22', '4:00 PM', 'Central Kitsap', 'away', 'Central Kitsap HS', 'game', null, null, null),
('j15', 'jv', '2026-04-25', '11:00 AM', 'West Seattle', 'home', 'GHHS', 'game', null, null, null),
('j16', 'jv', '2026-04-28', '4:00 PM', 'Peninsula', 'home', 'GHHS', 'game', null, null, null),
('j17', 'jv', '2026-04-29', '4:00 PM', 'Capital', 'home', 'GHHS', 'game', null, null, null),
('j18', 'jv', '2026-05-04', '4:00 PM', 'Timberline', 'away', 'Timberline HS', 'game', null, null, null),
('j19', 'jv', '2026-05-08', '4:00 PM', 'Curtis', 'away', 'Curtis HS', 'game', null, null, null);

-- C TEAM GAMES
insert into games (id, team, date, time, opponent, location, venue, type, score_us, score_them, result, notes) values
('c1', 'cteam', '2026-03-21', '11:00 AM', 'South Kitsap (G1)', 'home', 'GHHS', 'game', 1, 10, 'L', 'DH Game 1'),
('c2', 'cteam', '2026-03-21', '2:00 PM', 'South Kitsap (G2)', 'home', 'GHHS', 'game', 17, 15, 'W', 'DH Game 2'),
('c3', 'cteam', '2026-03-24', '3:30 PM', 'Puyallup', 'away', 'PRC', 'game', 3, 4, 'L', null),
('c4', 'cteam', '2026-03-28', '12:00 PM', 'Steilacoom (G1)', 'home', 'GHHS', 'game', 5, 9, 'L', 'DH Game 1'),
('c5', 'cteam', '2026-03-28', '2:00 PM', 'Steilacoom (G2)', 'home', 'GHHS', 'game', 22, 18, 'W', 'DH Game 2'),
('c6', 'cteam', '2026-03-30', '4:00 PM', 'Peninsula (PHS)', 'home', 'GHHS', 'game', 14, 15, 'L', null),
('c7', 'cteam', '2026-04-04', '11:00 AM', 'North Kitsap (G1)', 'away', 'North Kitsap HS', 'game', 15, 6, 'W', 'DH Game 1'),
('c8', 'cteam', '2026-04-04', '1:00 PM', 'North Kitsap (G2)', 'away', 'North Kitsap HS', 'game', 5, 9, 'L', 'DH Game 2'),
('c9', 'cteam', '2026-04-09', '4:00 PM', 'Peninsula (PHS)', 'away', 'PHS', 'game', 11, 1, 'W', null),
('c10', 'cteam', '2026-04-10', '3:30 PM', 'Puyallup', 'away', 'PRC', 'game', null, null, null, null),
('c11', 'cteam', '2026-04-15', '3:30 PM', 'Puyallup', 'away', 'PRC', 'game', null, null, null, null),
('c12', 'cteam', '2026-04-18', '11:00 AM', 'Bellarmine Prep (DH)', 'away', 'Bellarmine HS', 'game', null, null, null, null),
('c13', 'cteam', '2026-04-25', '2:00 PM', 'West Seattle', 'home', 'Sehmel Park', 'game', null, null, null, null),
('c14', 'cteam', '2026-04-27', '4:00 PM', 'Peninsula (PHS)', 'away', 'PHS', 'game', null, null, null, null),
('c15', 'cteam', '2026-05-02', '11:00 AM', 'Bellarmine Prep (DH)', 'away', 'Bellarmine HS', 'game', null, null, null, null),
('c16', 'cteam', '2026-05-08', '3:30 PM', 'Puyallup', 'away', 'PRC', 'game', null, null, null, null);

-- VARSITY PLAYERS
insert into players (id, team, first_name, last_name, number, positions, grad_year, bats, throws) values
('v-anderson', 'varsity', 'Kyle', 'Anderson', 5, '{"LHP"}', 2026, 'L', 'L'),
('v-bentley', 'varsity', 'Cam', 'Bentley', 12, '{"RHP","1B","OF"}', 2027, 'R', 'R'),
('v-bergford', 'varsity', 'Max', 'Bergford', 22, '{"LHP","DH"}', 2028, 'L', 'L'),
('v-bockhorn', 'varsity', 'Quentin', 'Bockhorn', 20, '{"RHP"}', 2026, 'R', 'R'),
('v-cheek', 'varsity', 'Nate', 'Cheek', 18, '{"RHP"}', 2026, 'R', 'R'),
('v-collins', 'varsity', 'Carter', 'Collins', 19, '{"C"}', 2026, 'R', 'R'),
('v-coray', 'varsity', 'Jason', 'Coray', 3, '{"2B","3B"}', 2028, 'R', 'R'),
('v-cuda', 'varsity', 'Jake', 'Cuda', 16, '{"RHP","OF"}', 2026, 'R', 'R'),
('v-harthorn', 'varsity', 'Spencer', 'Harthorn', 4, '{"RHP","2B","SS","3B"}', 2029, 'R', 'R'),
('v-knight', 'varsity', 'Jaxson', 'Knight', 15, '{"C"}', 2027, 'R', 'R'),
('v-hpayne', 'varsity', 'Hunter', 'Payne', 11, '{"SS","3B","2B"}', 2026, 'R', 'R'),
('v-spayne', 'varsity', 'Sawyer', 'Payne', 1, '{"RHP","IF","OF"}', 2028, 'R', 'R'),
('v-pedersen', 'varsity', 'Logan', 'Pedersen', 14, '{"RHP","1B"}', 2026, 'R', 'R'),
('v-price', 'varsity', 'Jack', 'Price', 10, '{"RHP","OF"}', 2026, 'R', 'R'),
('v-riley', 'varsity', 'Greyson', 'Riley', 13, '{"LHP","OF"}', 2026, 'L', 'L'),
('v-sams', 'varsity', 'Mason', 'Sams', 7, '{"OF"}', 2026, 'R', 'R'),
('v-sleeter', 'varsity', 'Daniel', 'Sleeter', 2, '{"RHP","SS","3B","C"}', 2028, 'R', 'R'),
('v-hasmith', 'varsity', 'Hawken', 'Smith', 14, '{"C","1B","IF"}', 2028, 'R', 'R'),
('v-husmith', 'varsity', 'Hudson', 'Smith', 8, '{"OF","IF"}', 2026, 'R', 'R'),
('v-zsmith', 'varsity', 'Zach', 'Smith', 9, '{"RHP","SS","3B","C"}', 2027, 'R', 'R'),
('v-wilson', 'varsity', 'Parker', 'Wilson', 17, '{"RHP","1B"}', 2027, 'R', 'R');

-- JV PLAYERS
insert into players (id, team, first_name, last_name, number, positions, grad_year, bats, throws) values
('j-attebery', 'jv', 'Chase', 'Attebery', 1, '{"IF","OF"}', 2028, 'R', 'R'),
('j-bass', 'jv', 'Oliver', 'Bass', 3, '{"RHP","OF"}', 2028, 'R', 'R'),
('j-evans', 'jv', 'Henry', 'Evans', 5, '{"IF","OF"}', 2028, 'R', 'R'),
('j-flowers', 'jv', 'Cam', 'Flowers', 7, '{"RHP","C"}', 2028, 'R', 'R'),
('j-griswold', 'jv', 'Luke', 'Griswold', 9, '{"OF"}', 2028, 'R', 'R'),
('j-hildebrand', 'jv', 'Griffin', 'Hildebrand', 11, '{"IF","OF"}', 2028, 'R', 'R'),
('j-justice', 'jv', 'Michael', 'Justice', 13, '{"RHP","1B"}', 2028, 'R', 'R'),
('j-knapp', 'jv', 'Ethan', 'Knapp', 15, '{"C","IF"}', 2028, 'R', 'R'),
('j-newgard', 'jv', 'Jackson', 'Newgard', 17, '{"IF"}', 2028, 'R', 'R'),
('j-rioux', 'jv', 'Finley', 'Rioux', 19, '{"OF"}', 2028, 'R', 'R'),
('j-shoquist', 'jv', 'Evan', 'Shoquist', 21, '{"RHP","IF"}', 2028, 'R', 'R'),
('j-turnley', 'jv', 'Ryder', 'Turnley', 23, '{"OF","IF"}', 2028, 'R', 'R'),
('j-vitcovich', 'jv', 'Jonah', 'Vitcovich', 25, '{"C","OF"}', 2028, 'R', 'R'),
('j-vorobets', 'jv', 'Danny', 'Vorobets', 27, '{"RHP","IF"}', 2028, 'R', 'R');

-- C TEAM PLAYERS
insert into players (id, team, first_name, last_name, number, positions, grad_year, bats, throws) values
('c-barclay', 'cteam', 'Evan', 'Barclay', 2, '{"IF","OF"}', 2029, 'R', 'R'),
('c-blankers', 'cteam', 'Rowan', 'Blankers', 4, '{"RHP","IF"}', 2029, 'R', 'R'),
('c-brown', 'cteam', 'Trevor', 'Brown', 6, '{"C","IF"}', 2029, 'R', 'R'),
('c-bush', 'cteam', 'Alexander', 'Bush', 8, '{"OF"}', 2029, 'R', 'R'),
('c-cuda', 'cteam', 'Sam', 'Cuda', 10, '{"IF","OF"}', 2029, 'R', 'R'),
('c-janin', 'cteam', 'Cooper', 'Janin', 12, '{"RHP","OF"}', 2029, 'R', 'R'),
('c-krause', 'cteam', 'Cole', 'Krause', 14, '{"IF"}', 2029, 'R', 'R'),
('c-laplante', 'cteam', 'Gabe', 'LaPlante', 16, '{"C","1B"}', 2029, 'R', 'R'),
('c-michael', 'cteam', 'Henry', 'Michael', 18, '{"RHP","IF"}', 2029, 'R', 'R'),
('c-occhiogrosso', 'cteam', 'Luca', 'Occhiogrosso', 20, '{"OF"}', 2029, 'R', 'R'),
('c-olsen', 'cteam', 'Hunter', 'Olsen', 22, '{"IF","OF"}', 2029, 'R', 'R'),
('c-reed', 'cteam', 'Landon', 'Reed', 24, '{"RHP","OF"}', 2029, 'R', 'R'),
('c-richards', 'cteam', 'Lucas', 'Richards', 26, '{"IF"}', 2029, 'R', 'R'),
('c-wellborn', 'cteam', 'Lief', 'Wellborn', 28, '{"C","OF"}', 2029, 'R', 'R');
