CREATE TABLE chef
(id        SERIAL        PRIMARY KEY
,username  VARCHAR(200)  NOT NULL 
,password  VARCHAR(255)  NOT NULL
,UNIQUE (username)
);

CREATE TABLE recipe 
(id          SERIAL      PRIMARY KEY
,f2f_rid     INTEGER                             NOT NULL
,recipe_name VARCHAR(200)                        NOT NULL
,imageURL    TEXT                                NOT NULL
,source      TEXT                                NOT NULL
,ingredients TEXT[]                              NOT NULL
, UNIQUE (f2f_rid)
);

CREATE TABLE favorite
(id          SERIAL       PRIMARY KEY
,chef_id     INTEGER      REFERENCES chef(id)
,recipe_id   INTEGER      REFERENCES recipe(id)
,UNIQUE (chef_id, recipe_id)
);


recipes=# alter table recipe rename recipe_name to title;
ALTER TABLE
recipes=# alter table recipe rename imageurl to image_url;
ALTER TABLE
recipes=# alter table recipe rename source to source_url;
ALTER TABLE
recipes=# alter table recipe rename recipe_id to f2f_rid;
ERROR:  column "recipe_id" does not exist
recipes=# alter table recipe rename f2f_rid to recipe_id 