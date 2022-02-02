insert into "chefs" ("name", "photoUrl", "bio")
values ('Gordon Ramsay', 'images/ramsay.jpeg', 'Scottish by birth, Gordon Ramsay was brought up in Stratford-upon-Avon, England. With an injury prematurely putting an end to any hopes of a promising career in football, he went back to college to complete a course in hotel management. His dedication and natural talent led him to train with some of the worlds leading chefs, such as Albert Roux and Marco Pierre White in London, and Guy Savoy and Joël Robuchon in France.'),
       ('Wolfgang Puck', 'images/wolfgang-2.jpeg', 'Wolfgang Puck is an Austrian-born American celebrity chef and restaurateur, who is famous all over the world for his high-end gourmet restaurants, catering services and cookbooks. Best known for his signature dish, the House Smoked Salmon Pizza, Puck is also much renowned for whipping up dishes like Classic Chicken Pot Pie and Catalonian Fire Roasted Lamb Rack. His fascination with food began decades ago when as a young kid he used to observe his mother cooking in the kitchen. His mother was a restaurant chef and young Wolfgang soon decided that he too wanted to be one, much to the chagrin of his father.'),
       ('Masaharu Morimoto', 'images/morimoto-2.jpeg', 'Born in Hiroshima, Japan, Iron Chef Japanese Masaharu Morimoto trained in a sushi restaurant before moving to the U.S. in 1985 at the age of 30. After working in several restaurants, he joined the highly acclaimed Nobu restaurant in New York City.'),
       ('Massimo Bottura', 'images/bottura.jpeg', 'Massimo Bottura is an Italian restaurateur and the chef patron of Osteria Francescana, a three-Michelin-star restaurant based in Modena, Italy which has been listed in the top 5 at The Worlds 50 Best Restaurants Awards since 2010 and received top ratings from LEspresso, Gambero Rosso and the Touring Club guides.'),
       ('Lidia Bastianich', 'images/bastlanich.jpeg', 'Lidia Giuliana Matticchio Bastianich is an Italian-American celebrity chef, television host, author, and restaurateur. Specializing in Italian and Italian-American cuisine, Bastianich has been a regular contributor to public television cooking shows since 1998.'),
       ('Giorgio Locatelli', 'images/locatelli.jpeg', 'Giorgio Locatelli is an innovative Italian chef and star of his own TV series, Giorgio Locatelli: Pure Italian. Giorgio grew up in Northern Italy, where his family ran a Michelin-starred restaurant. His career took him from Italy to Switzerland, England and France before he returned to the UK and became head chef at Londons Olivo.');


insert into "dishes" ("chefId", "name", "photoUrl")
values (1, 'Tomato Spinach Pasta', 'images/pasta.jpeg'),
       (1, 'Cheeseburger', 'images/cheeseburger.jpeg'),
       (1, 'Tofu & Watercress Salad', 'images/salad.jpeg'),
       (1, 'French Onion Soup', 'images/soup.jpeg'),
       (2, 'Coffee', 'images/coffee.jpeg'),
       (2, 'Garden Salad', 'images/salad.jpeg'),
       (2, 'New York Steak', 'images/steak.jpeg'),
       (2, 'California Burrito', 'images/burrito.jpeg'),
       (3, 'Kimchi', 'images/kimchi.jpeg'),
       (3, 'California Roll', 'images/caliroll.jpeg'),
       (3, 'Tonkatsu', 'images/tonkatsu.jpeg'),
       (3, 'Beef Udon', 'images/udon.jpeg'),
       (4, 'Carbonara', 'images/carbonara.jpeg'),
       (4, 'Gnocci', 'images/gnocci.jpeg'),
       (4, 'Pepperoni Pizza', 'images/pepperoni-pizza.jpeg'),
       (4, 'Puttanesca', 'images/puttanesca.jpeg'),
       (5, 'Combination Pizza', 'images/combination-pizza.jpeg'),
       (5, 'Lasagna', 'images/lasagna.jpeg'),
       (5, 'Italian Pudding', 'images/pudding.jpeg'),
       (5, 'Steak and Broccoli', 'images/steak-broccoli.jpeg'),
       (6, 'Margarita Pasta', 'images/margarita-pasta.jpeg'),
       (6, 'Cream Puffs', 'images/cream-puffs.jpeg'),
       (6, 'Tiramisu', 'images/tiramisu.jpeg'),
       (6, 'Seafood Pasta', 'images/seafood-pasta.jpeg');



insert into "users" ("username", "password", "createdAt")
values('Guest', 'testing123', current_timestamp);

insert into "reviews" ("userId", "chefId", "content", "rating", "createdAt")
values (1, 1, 'Food is Amazing!', 5, current_timestamp),
       (1, 2, 'Great food!', 5, current_timestamp),
       (1, 3, 'Amazing Sushi!', 5, current_timestamp),
       (1, 4, 'Amazing!', 5, current_timestamp),
       (1, 5, 'Yummy food!', 5, current_timestamp),
       (1, 6, 'Best food ever!', 5, current_timestamp);


insert into "cuisines" ("name")
values ('Italian'),
       ('French'),
       ('Chinese'),
       ('Japanese'),
       ('Greek'),
       ('Spanish'),
       ('Mediterranean'),
       ('Korean'),
       ('Indian'),
       ('American'),
       ('Mexican');

insert into "chefCuisines" ("chefId", "cuisineId")
values (1, 1),
       (1, 2),
       (2, 1),
       (2, 5),
       (2, 7),
       (3, 4),
       (4, 1),
       (4, 5),
       (5, 1),
       (6, 1),
       (6, 2);

insert into "favorites" ("userId", "chefId")
values (1, 1)




-- select   "chefId", "chefs"."name", "photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType"
--     from     "chefs"
--     join     "reviews" using ("chefId")
--     join     "chefCuisines" using ("chefId")
--     join     "cuisines" using ("cuisineId")
--     where    "cuisines"."name" = 'Italian'
--     group by "chefs"."chefId"



-- select *
-- from "favorites"
-- join "users" using ("userId")
-- join "chefs" using ("chefId")

-- select "chefId", "chefs"."name", "photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType"
-- from "favorites"
-- join "users" using ("userId")
-- join "chefs" using ("chefId")
-- join "chefCuisines" using ("chefId")
-- join "cuisines" using ("cuisineId")
-- join "reviews" using ("chefId")
-- group by "favorites"."chefId",
--          "chefs"."name",
--          "chefs"."photoUrl",
--          "users"."username"
