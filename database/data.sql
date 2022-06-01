insert into "chefs" ("username", "photoUrl", "bio", "createdAt")
values ('Gordon', 'images/ramsay.jpeg', 'Scottish by birth, Gordon Ramsay was brought up in Stratford-upon-Avon, England. With an injury prematurely putting an end to any hopes of a promising career in football, he went back to college to complete a course in hotel management. His dedication and natural talent led him to train with some of the worlds leading chefs, such as Albert Roux and Marco Pierre White in London, and Guy Savoy and Joël Robuchon in France.', current_timestamp);

insert into "dishes" ("chefId", "name", "photoUrl")
values (1, 'Tomato Spinach Pasta', 'images/pasta.jpeg'),
       (1, 'Cheeseburger', 'images/cheeseburger.jpeg'),
       (1, 'Tofu & Watercress Salad', 'images/salad.jpeg'),
       (1, 'French Onion Soup', 'images/soup.jpeg');

insert into "users" ("username", "password", "photoUrl", "createdAt")
values('Guest', 'testing123', 'images/testing-image.jpeg', current_timestamp);

insert into "reviews" ("chefId", "userId", "content", "rating", "createdAt")
values (1, 1, NULL, NULL, current_timestamp);

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

insert into "chefCuisines" ("userId", "chefId", "cuisineId")
values (1, 1, 1),
       (1, 1, 2);

insert into "favorites" ("userId", "chefId")
values (1, 1);

insert into "chatRooms" ("userId", "chefId")
values (1, 1);

insert into "messages" ("roomId", "author", "message", "createdAt")
values (1, 'Gordon', 'testing', current_timestamp);
