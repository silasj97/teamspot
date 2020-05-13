USE tournamentbuzz;
# creates a user with email "test@test.com" and password 12345678
INSERT INTO `users` (`email`,`password`,`userName`) VALUES ('test@test.com','$2b$10$vQXr1lG6chC1nEVTrSkoKOSRyVnZ3S6G9LFwZcUY9srnstpifL7xy','Test User');
# creates a tournament with various values, the user above is the creator
INSERT INTO `tournaments` (`id`,`creator`,`description`,`maxTeamSize`,`location`,`scoringType`,`tournamentName`,`tournamentType`,`entryCost`,`maxTeams`,`startDate`,`endDate`) VALUES (1,'test@test.com','Volleyball Tournament at Georgia Tech',5,'Tech Green','Points','Bob\'s Test Tournament','Single Elim',0,16,'2019-05-01','2019-05-08');
# creates a team for the tournament with this user
INSERT INTO `teams` (`teamName`, `leader`, `tournament`, `seed`) VALUES ('Potato Squad', 'test@test.com', 1, null);
# creates the member listing
INSERT INTO `teamMembers` (`userEmail`, `teamId`, `invited`, `requested`, `approved`) VALUES ('test@test.com', 1, true, false, true);


# creates a second user with email "a@b.co" and password 12345678
INSERT INTO `users` (`email`,`password`,`userName`) VALUES ('a@b.co','$2b$10$vQXr1lG6chC1nEVTrSkoKOSRyVnZ3S6G9LFwZcUY9srnstpifL7xy','Test User 2');
# creates a team for the tournament with the second user
INSERT INTO `teams` (`teamName`, `leader`, `tournament`, `seed`) VALUES ('The B Team', 'a@b.co', 1, null);
# creates the member listing
INSERT INTO `teamMembers` (`userEmail`, `teamId`, `invited`, `requested`, `approved`) VALUES ('a@b.co', 2, false, true, true);

# creates a match
INSERT INTO `matches` (`location`, `matchTime`, `matchName`, `tournament`, `teamA`, `teamB`) VALUES ('CULC 152', '2019-05-01 14:00:00', 'Finals', 1, 1, 2);
