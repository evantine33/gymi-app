-- ============================================================
-- Gymi App — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Profiles ─────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  phone       text,
  role        text not null default 'member'
                check (role in ('coach', 'member', 'nonmember', 'admin')),
  gym_id      text,
  join_date   date default current_date,
  initials    text,
  created_at  timestamptz default now()
);

-- ─── Gyms ─────────────────────────────────────────────────
create table if not exists public.gyms (
  id          text primary key,
  name        text not null,
  join_code   text unique not null,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz default now()
);

-- Add foreign key from profiles → gyms after both tables exist
alter table public.profiles
  add constraint profiles_gym_id_fkey
  foreign key (gym_id) references public.gyms(id)
  on delete set null
  not valid;

-- ─── Workouts ─────────────────────────────────────────────
create table if not exists public.workouts (
  id          text primary key,
  title       text not null,
  date        date not null,
  gym_id      text references public.gyms(id) on delete cascade,
  created_by  uuid references public.profiles(id),
  exercises   jsonb not null default '[]'::jsonb,
  warmup      jsonb default '[]'::jsonb,
  created_at  timestamptz default now()
);

-- ─── Workout Logs ─────────────────────────────────────────
create table if not exists public.workout_logs (
  id            text primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  exercise_id   text not null,
  workout_id    text references public.workouts(id) on delete cascade,
  gym_id        text references public.gyms(id) on delete cascade,
  exercise_name text default '',
  sets          jsonb,
  notes         text default '',
  logged_at     timestamptz default now(),
  unique (user_id, workout_id, exercise_id)
);

-- ─── Row Level Security ────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.gyms        enable row level security;
alter table public.workouts    enable row level security;
alter table public.workout_logs enable row level security;

-- PROFILES
create policy "Users can view profiles in their gym"
  on public.profiles for select
  using (
    id = auth.uid()
    or gym_id = (select gym_id from public.profiles where id = auth.uid())
  );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- GYMS — anyone can read (needed for join-code lookup before login)
create policy "Anyone can read gyms"
  on public.gyms for select
  using (true);

create policy "Coaches can insert gyms"
  on public.gyms for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'coach'
    )
  );

create policy "Coaches can update their own gym"
  on public.gyms for update
  using (created_by = auth.uid());

-- WORKOUTS
create policy "Gym members can view workouts"
  on public.workouts for select
  using (
    gym_id = (select gym_id from public.profiles where id = auth.uid())
  );

create policy "Coaches can insert workouts"
  on public.workouts for insert
  with check (
    gym_id = (select gym_id from public.profiles where id = auth.uid())
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'coach'
    )
  );

create policy "Coaches can update workouts in their gym"
  on public.workouts for update
  using (
    gym_id = (select gym_id from public.profiles where id = auth.uid())
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'coach'
    )
  );

create policy "Coaches can delete workouts in their gym"
  on public.workouts for delete
  using (
    gym_id = (select gym_id from public.profiles where id = auth.uid())
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'coach'
    )
  );

-- WORKOUT LOGS
create policy "Gym members can view all logs in their gym"
  on public.workout_logs for select
  using (
    gym_id = (select gym_id from public.profiles where id = auth.uid())
  );

create policy "Members can insert their own logs"
  on public.workout_logs for insert
  with check (user_id = auth.uid());

create policy "Members can update their own logs"
  on public.workout_logs for update
  using (user_id = auth.uid());

-- ─── Realtime ─────────────────────────────────────────────
-- Enable realtime for workouts and logs tables
-- (Do this in Supabase Dashboard → Database → Replication)
-- Or run:
alter publication supabase_realtime add table public.workouts;
alter publication supabase_realtime add table public.workout_logs;
