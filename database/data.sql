insert into "chefs" ("name", "photoUrl", "bio")
values ('Gordon Ramsay', 'images/ramsay.jpeg', 'testing')

insert into "dishes" ("chefId", "name", "photoUrl")
values (1, 'Tomato Spinach Pasta', 'images/pasta.jpeg'),
       (1, 'Cheeseburger', 'images/Cheeseburger.jpeg'),
       (1, 'Tofu & Watercress Salad', 'images/salad.jpeg'),
       (1, 'French Onion Soup', 'images/soup.jpeg')

insert into "users" ("username", "password", "createdAt")
values('User1', 'testing123', current_timestamp)

insert into "reviews" ("userId", "chefId", "content", "rating", "createdAt")
values (3, 1, 'testing', 5, current_timestamp)

insert into "cuisines" ("name")
values ("Italian"),
       ("French"),
       ("Chinese"),
       ("Japanese"),
       ("Greek"),
       ("Spanish"),
       ("Mediterranean"),
       ("Korean"),
       ("Indian"),
       ("American"),
       ("Mexican")

insert into "chefCuisines" ("chefId", "cuisineId")
values (1, 1),
       (1, 2)

select   "chefId", "chefs"."name", "photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType"
    from     "chefs"
    join     "reviews" using ("chefId")
    join     "chefCuisines" using ("chefId")
    join     "cuisines" using ("cuisineId")
    where    "cuisines"."name" = 'Italian'
    group by "chefs"."chefId"

insert into "favorites" ("userId", "chefId")
values (3, 1)




select *
from "favorites"
join "users" using ("userId")
join "chefs" using ("chefId")

select "chefId", "chefs"."name", "photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType"
from "favorites"
join "users" using ("userId")
join "chefs" using ("chefId")
join "chefCuisines" using ("chefId")
join "cuisines" using ("cuisineId")
join "reviews" using ("chefId")
group by "favorites"."chefId",
         "chefs"."name",
         "chefs"."photoUrl",
         "users"."username"
