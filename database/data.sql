insert into "chefs" ("name", "photoUrl", "bio")
values ('Gordon Ramsay', 'images/ramsay.jpeg', 'Scottish by birth, Gordon Ramsay was brought up in Stratford-upon-Avon, England. With an injury prematurely putting an end to any hopes of a promising career in football, he went back to college to complete a course in hotel management. His dedication and natural talent led him to train with some of the worlds leading chefs, such as Albert Roux and Marco Pierre White in London, and Guy Savoy and Joël Robuchon in France.'),
       ('Wolfgang Puck', 'images/wolfgang.jpeg', 'Wolfgang Puck is an Austrian-born American celebrity chef and restaurateur, who is famous all over the world for his high-end gourmet restaurants, catering services and cookbooks. Best known for his signature dish, the House Smoked Salmon Pizza, Puck is also much renowned for whipping up dishes like Classic Chicken Pot Pie and Catalonian Fire Roasted Lamb Rack. His fascination with food began decades ago when as a young kid he used to observe his mother cooking in the kitchen. His mother was a restaurant chef and young Wolfgang soon decided that he too wanted to be one, much to the chagrin of his father.'),
       ('Mahaharu Morimoto', 'images/morimoto.jpeg', 'Born in Hiroshima, Japan, Iron Chef Japanese Masaharu Morimoto trained in a sushi restaurant before moving to the U.S. in 1985 at the age of 30. After working in several restaurants, he joined the highly acclaimed Nobu restaurant in New York City.');

insert into "dishes" ("chefId", "name", "photoUrl")
values (1, 'Tomato Spinach Pasta', 'images/pasta.jpeg'),
       (1, 'Cheeseburger', 'images/Cheeseburger.jpeg'),
       (1, 'Tofu & Watercress Salad', 'images/salad.jpeg'),
       (1, 'French Onion Soup', 'images/soup.jpeg'),
       (2, 'Coffee', 'images/coffee.jpeg'),
       (2, 'Garden Salad', 'images/salad.jpeg'),
       (2, 'New York Steak', 'images/steak.jpeg'),
       (2, 'California Burrito', 'images/burrito.jpeg'),
       (3, 'Kimchi', 'images/kimchi.jpeg'),
       (3, 'California Roll', 'images/caliroll.jpeg'),
       (3, 'Tonkatsu', 'images/tonkatsu.jpeg'),
       (3, 'Beef Udon', 'images/udon.jpeg');


insert into "users" ("username", "password", "createdAt")
values('User1', 'testing123', current_timestamp);

insert into "reviews" ("userId", "chefId", "content", "rating", "createdAt")
values (1, 1, 'Food is Amazing!', 5, current_timestamp);


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
       (3, 4)

-- select   "chefId", "chefs"."name", "photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType"
--     from     "chefs"
--     join     "reviews" using ("chefId")
--     join     "chefCuisines" using ("chefId")
--     join     "cuisines" using ("cuisineId")
--     where    "cuisines"."name" = 'Italian'
--     group by "chefs"."chefId"

insert into "favorites" ("userId", "chefId")
values (1, 1)




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
