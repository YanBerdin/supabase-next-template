-- 20250825_sync_profiles_with_users.sql
-- Migration : Synchronisation des profils existants avec les utilisateurs auth.users
-- Cette migration ajoute les entrées manquantes dans la table public.profiles pour chaque utilisateur existant dans auth.users
-- Conforme aux guides de style et de gestion de schéma du projet

insert into public.profiles (user_id, first_name, last_name, role)
select
  u.id as user_id,
  u.raw_user_meta_data ->> 'first_name' as first_name,
  u.raw_user_meta_data ->> 'last_name' as last_name,
  coalesce(u.raw_user_meta_data ->> 'role', 'member') as role
from
  auth.users as u
left join
  public.profiles as p on p.user_id = u.id
where
  p.user_id is null;
