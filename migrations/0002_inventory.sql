-- Shared shop inventory. Every signed-in teammate sees the same stock.
-- created_by / sold_by / actor_id are Better Auth user ids (text).

create table if not exists products (
  id              serial primary key,
  name            text not null,
  description     text not null default '',
  purchase_price  numeric(12, 2) not null,
  picture_url     text,
  status          text not null default 'in_stock',
  created_by      text not null,
  created_by_name text not null,
  created_at      timestamptz not null default now(),
  constraint products_status_chk check (status in ('in_stock', 'sold'))
);

create index if not exists products_status_idx on products (status);
create index if not exists products_created_by_idx on products (created_by);

create table if not exists sales (
  id             serial primary key,
  product_id     integer not null references products (id) on delete cascade,
  selling_price  numeric(12, 2) not null,
  profit         numeric(12, 2) not null,
  sold_by        text not null,
  sold_by_name   text not null,
  sold_at        timestamptz not null default now()
);

create unique index if not exists sales_product_id_uidx on sales (product_id);

create table if not exists activity (
  id           serial primary key,
  actor_id     text not null,
  actor_name   text not null,
  action       text not null,
  product_id   integer,
  product_name text not null,
  detail       text not null default '',
  created_at   timestamptz not null default now(),
  constraint activity_action_chk check (action in ('added', 'sold', 'removed'))
);

create index if not exists activity_created_at_idx on activity (created_at desc);
create index if not exists activity_actor_id_idx on activity (actor_id);

-- Demo stock so a new shop can try the sell flow immediately.
insert into products (name, description, purchase_price, picture_url, status, created_by, created_by_name)
select * from (values
  (
    'Stoneware mug',
    'Hand-thrown mug with a forest glaze and a heavy foot.',
    14.00,
    '/products/mug.svg',
    'in_stock',
    'system',
    'Stockroom'
  ),
  (
    'Brass desk lamp',
    'Adjustable arm, cream shade, warm directional light.',
    48.00,
    '/products/lamp.svg',
    'in_stock',
    'system',
    'Stockroom'
  ),
  (
    'Studio headphones',
    'Closed-back cans for mixing at the bench.',
    89.00,
    '/products/headphones.svg',
    'in_stock',
    'system',
    'Stockroom'
  ),
  (
    'Linen notebook',
    'A5, 120 pages, dotted grid, stitched binding.',
    12.00,
    '/products/notebook.svg',
    'in_stock',
    'system',
    'Stockroom'
  ),
  (
    'Olive tree',
    'Young tree in a terracotta pot. Water sparingly.',
    36.00,
    '/products/plant.svg',
    'in_stock',
    'system',
    'Stockroom'
  ),
  (
    'Enamel kettle',
    'Stovetop kettle, cream enamel, forest handle.',
    28.00,
    '/products/kettle.svg',
    'in_stock',
    'system',
    'Stockroom'
  )
) as seed(name, description, purchase_price, picture_url, status, created_by, created_by_name)
where not exists (select 1 from products);
