SELECT  movies.title, ratings.rating FROM movies INNER JOIN ratings ON movies.id = ratings.movie_id AND movies.year = 2010 AND ratings.rating ORDER BY ratings.rating DESC, title ASC;
