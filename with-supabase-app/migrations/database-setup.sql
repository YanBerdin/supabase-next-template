-- Création des tables

-- Table des utilisateurs (extension à la table auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'coach')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un trigger pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à la table profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Création d'une politique RLS pour la table profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Table des équipes
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  coach TEXT NOT NULL,
  championship TEXT,
  schedule TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des actualités
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des événements
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('match', 'training', 'tournament', 'meeting', 'other')),
  team_id UUID REFERENCES public.teams(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des médias
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des matchs
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) NOT NULL,
  opponent TEXT NOT NULL,
  location TEXT NOT NULL,
  is_home BOOLEAN NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  score_home INTEGER,
  score_away INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de démonstration

-- Équipes
INSERT INTO public.teams (name, category, coach, championship, schedule, description, image_url) VALUES
('Seniors Masculins', 'Seniors', 'Thomas Dubois', 'Régionale 2', 'Entraînements : Mardi et Jeudi 20h-22h', 'Notre équipe fanion masculine évolue en Régionale 2. Composée de joueurs expérimentés et de jeunes talents, elle vise la montée en Régionale 1.', '/placeholder.svg?height=300&width=500'),
('Seniors Féminines', 'Seniors', 'Caroline Dumont', 'Régionale 3', 'Entraînements : Lundi et Mercredi 20h-22h', 'Notre équipe senior féminine évolue en Régionale 3. Composée d''un mélange de joueuses expérimentées et de jeunes talents, elle vise le haut du classement.', '/placeholder.svg?height=300&width=500'),
('U17 Masculins', 'Cadets', 'Philippe Martin', 'Départemental', 'Entraînements : Mercredi 18h-20h et Vendredi 17h-19h', 'Nos U17 masculins forment une équipe prometteuse qui progresse rapidement. Ils participent au championnat départemental avec l''objectif d''accéder au niveau régional.', '/placeholder.svg?height=300&width=500'),
('U17 Féminines', 'Cadettes', 'Sophie Leroy', 'Régionale', 'Entraînements : Mardi 18h-20h et Jeudi 18h-20h', 'Les U17 féminines évoluent au niveau régional. Finalistes du championnat la saison dernière, elles visent le titre cette année.', '/placeholder.svg?height=300&width=500'),
('U15 Masculins', 'Minimes', 'Laurent Petit', 'Départemental', 'Entraînements : Mercredi 16h-18h et Samedi 10h-12h', 'L''équipe U15 masculine est composée de jeunes joueurs talentueux qui développent leurs compétences techniques et tactiques. Champions départementaux en titre.', '/placeholder.svg?height=300&width=500'),
('U15 Féminines', 'Minimes', 'Émilie Blanc', 'Départemental', 'Entraînements : Mercredi 16h-18h et Vendredi 17h30-19h', 'L''équipe U15 féminine progresse rapidement et développe un jeu collectif prometteur. Elles visent une qualification pour les phases finales départementales.', '/placeholder.svg?height=300&width=500'),
('U13 Masculins', 'Benjamins', 'Julien Moreau', 'Départemental', 'Entraînements : Mercredi 14h-16h et Samedi 9h-10h30', 'Notre équipe U13 masculine met l''accent sur l''apprentissage des fondamentaux du basket et le développement du jeu collectif.', '/placeholder.svg?height=300&width=500'),
('U13 Féminines', 'Benjamines', 'Marie Rousseau', 'Départemental', 'Entraînements : Mercredi 14h-16h et Samedi 10h30-12h', 'Notre équipe U13 féminine se concentre sur l''apprentissage des fondamentaux et le développement de l''esprit d''équipe.', '/placeholder.svg?height=300&width=500');

-- Événements
INSERT INTO public.events (title, description, location, start_time, end_time, category, team_id) VALUES
('Match Seniors Masculins vs BC Dijon', 'Match de championnat Régionale 2', 'Gymnase du Réveil, Is-sur-Tille', '2025-04-20 20:30:00+02', '2025-04-20 22:30:00+02', 'match', (SELECT id FROM public.teams WHERE name = 'Seniors Masculins')),
('Match U17 Féminines vs Auxonne Basket', 'Match de championnat Régionale', 'Gymnase d''Auxonne', '2025-04-21 15:00:00+02', '2025-04-21 17:00:00+02', 'match', (SELECT id FROM public.teams WHERE name = 'U17 Féminines')),
('Match Seniors Féminines vs Chenôve BC', 'Match de championnat Régionale 3', 'Gymnase du Réveil, Is-sur-Tille', '2025-04-27 18:00:00+02', '2025-04-27 20:00:00+02', 'match', (SELECT id FROM public.teams WHERE name = 'Seniors Féminines')),
('Match U15 Masculins vs Genlis Basket', 'Match de championnat Départemental', 'Gymnase de Genlis', '2025-04-28 14:00:00+02', '2025-04-28 16:00:00+02', 'match', (SELECT id FROM public.teams WHERE name = 'U15 Masculins')),
('Match U13 Féminines vs Fontaine BC', 'Match de championnat Départemental', 'Gymnase du Réveil, Is-sur-Tille', '2025-05-04 10:30:00+02', '2025-05-04 12:30:00+02', 'match', (SELECT id FROM public.teams WHERE name = 'U13 Féminines')),
('Tournoi des jeunes', 'Tournoi pour les catégories U11 et U13', 'Gymnase municipal, Is-sur-Tille', '2025-04-20 09:00:00+02', '2025-04-21 18:00:00+02', 'tournament', NULL),
('Stage de perfectionnement', 'Stage pour les catégories U13 à U17', 'Gymnase du Réveil, Is-sur-Tille', '2025-04-24 09:00:00+02', '2025-04-28 17:00:00+02', 'training', NULL),
('Assemblée générale', 'Bilan de la saison et perspectives', 'Salle des fêtes, Is-sur-Tille', '2025-05-15 19:00:00+02', '2025-05-15 22:00:00+02', 'meeting', NULL),
('Fête du club', 'Animations, matchs et barbecue', 'Complexe sportif, Is-sur-Tille', '2025-06-18 10:00:00+02', '2025-06-18 22:00:00+02', 'other', NULL),
('Entraînement Seniors Masculins', 'Entraînement hebdomadaire', 'Gymnase du Réveil, Is-sur-Tille', '2025-04-16 20:00:00+02', '2025-04-16 22:00:00+02', 'training', (SELECT id FROM public.teams WHERE name = 'Seniors Masculins')),
('Entraînement Seniors Féminines', 'Entraînement hebdomadaire', 'Gymnase du Réveil, Is-sur-Tille', '2025-04-17 20:00:00+02', '2025-04-17 22:00:00+02', 'training', (SELECT id FROM public.teams WHERE name = 'Seniors Féminines')),
('Réunion des entraîneurs', 'Préparation de la fin de saison', 'Club house, Is-sur-Tille', '2025-04-22 19:00:00+02', '2025-04-22 21:00:00+02', 'meeting', NULL);

-- Actualités
INSERT INTO public.news (title, content, summary, image_url, category, published_at) VALUES
('Victoire de l''équipe senior masculine', 'Notre équipe senior masculine a remporté une victoire éclatante contre l''équipe de Dijon avec un score de 78-65. Une performance remarquable de notre capitaine qui a inscrit 25 points. L''équipe a montré une grande cohésion et une défense solide tout au long du match. Cette victoire nous permet de rester dans la course pour la montée en Régionale 1.', 'Notre équipe senior masculine a remporté une victoire éclatante contre l''équipe de Dijon avec un score de 78-65.', '/placeholder.svg?height=200&width=400', 'Match', '2025-04-15 22:00:00+02'),
('Tournoi des jeunes ce weekend', 'Ne manquez pas le tournoi des jeunes ce weekend au gymnase municipal. Plus de 10 équipes U11 et U13 s''affronteront dans une ambiance conviviale et sportive. Buvette et restauration sur place. Venez nombreux encourager nos jeunes basketteurs ! Les matchs débuteront samedi à 9h et se poursuivront dimanche toute la journée. La remise des prix aura lieu dimanche à 17h.', 'Ne manquez pas le tournoi des jeunes ce weekend au gymnase municipal. Plus de 10 équipes U11 et U13 s''affronteront dans une ambiance conviviale et sportive.', '/placeholder.svg?height=200&width=400', 'Événement', '2025-04-10 10:00:00+02'),
('Inscriptions ouvertes pour la saison 2025-2026', 'Les inscriptions pour la nouvelle saison sont désormais ouvertes. Rejoignez-nous pour une nouvelle année sportive riche en émotions et en partage. Les tarifs restent inchangés par rapport à la saison précédente. Des permanences pour les inscriptions seront organisées au gymnase les mercredis et samedis du mois de juin. N''oubliez pas d''apporter un certificat médical, une photo d''identité et le règlement de la cotisation.', 'Les inscriptions pour la nouvelle saison sont désormais ouvertes. Rejoignez-nous pour une nouvelle année sportive riche en émotions et en partage.', '/placeholder.svg?height=200&width=400', 'Club', '2025-04-05 14:00:00+02'),
('Stage de perfectionnement pendant les vacances', 'Un stage de perfectionnement sera organisé pendant les vacances de printemps pour les catégories U13 à U17. Inscrivez-vous rapidement, les places sont limitées. Au programme : travail technique, tactique, physique et matchs. Le stage se déroulera du 24 au 28 avril, de 9h à 17h. Prévoir un repas froid pour le midi. Le tarif est de 80€ pour la semaine, goûter inclus.', 'Un stage de perfectionnement sera organisé pendant les vacances de printemps pour les catégories U13 à U17. Inscrivez-vous rapidement, les places sont limitées.', '/placeholder.svg?height=200&width=400', 'Formation', '2025-04-01 09:00:00+02'),
('Nouveau partenariat avec Intersport', 'Nous sommes heureux d''annoncer notre nouveau partenariat avec Intersport qui équipera nos équipes pour la saison prochaine. Des réductions seront proposées à nos licenciés. Une séance d''essayage des nouveaux maillots et équipements sera organisée le samedi 15 mai au magasin Intersport de Dijon. Tous les licenciés bénéficieront d''une remise de 15% sur l''ensemble du rayon basket.', 'Nous sommes heureux d''annoncer notre nouveau partenariat avec Intersport qui équipera nos équipes pour la saison prochaine. Des réductions seront proposées à nos licenciés.', '/placeholder.svg?height=200&width=400', 'Partenariat', '2025-03-28 11:00:00+01'),
('Assemblée générale annuelle', 'L''assemblée générale annuelle du club se tiendra le 15 mai à 19h à la salle des fêtes d''Is-sur-Tille. Votre présence est importante pour la vie du club. À l''ordre du jour : bilan sportif et financier de la saison, projets pour la saison prochaine, élection du bureau. Un verre de l''amitié sera offert à l''issue de la réunion. Nous comptons sur votre présence !', 'L''assemblée générale annuelle du club se tiendra le 15 mai à 19h à la salle des fêtes d''Is-sur-Tille. Votre présence est importante pour la vie du club.', '/placeholder.svg?height=200&width=400', 'Club', '2025-03-25 16:00:00+01');

-- Matchs
INSERT INTO public.matches (team_id, opponent, location, is_home, date, time, score_home, score_away) VALUES
((SELECT id FROM public.teams WHERE name = 'Seniors Masculins'), 'BC Dijon', 'Gymnase du Réveil, Is-sur-Tille', TRUE, '2025-04-20', '20:30:00', NULL, NULL),
((SELECT id FROM public.teams WHERE name = 'U17 Féminines'), 'Auxonne Basket', 'Gymnase d''Auxonne', FALSE, '2025-04-21', '15:00:00', NULL, NULL),
((SELECT id FROM public.teams WHERE name = 'Seniors Féminines'), 'Chenôve BC', 'Gymnase du Réveil, Is-sur-Tille', TRUE, '2025-04-27', '18:00:00', NULL, NULL),
((SELECT id FROM public.teams WHERE name = 'U15 Masculins'), 'Genlis Basket', 'Gymnase de Genlis', FALSE, '2025-04-28', '14:00:00', NULL, NULL),
((SELECT id FROM public.teams WHERE name = 'U13 Féminines'), 'Fontaine BC', 'Gymnase du Réveil, Is-sur-Tille', TRUE, '2025-05-04', '10:30:00', NULL, NULL),
((SELECT id FROM public.teams WHERE name = 'Seniors Masculins'), 'Auxonne Basket', 'Gymnase du Réveil, Is-sur-Tille', TRUE, '2025-04-06', '20:30:00', 78, 65),
((SELECT id FROM public.teams WHERE name = 'Seniors Féminines'), 'BC Dijon', 'Gymnase de Dijon', FALSE, '2025-04-07', '18:00:00', 62, 70),
((SELECT id FROM public.teams WHERE name = 'U17 Masculins'), 'Chenôve BC', 'Gymnase du Réveil, Is-sur-Tille', TRUE, '2025-04-13', '16:00:00', 55, 48);

-- Médias
INSERT INTO public.media (title, description, url, type, category) VALUES
('Match Seniors Masculins vs BC Dijon', 'Photos du match du 15 avril 2025', '/placeholder.svg?height=300&width=400', 'image', 'matches'),
('Match U17 Féminines vs Auxonne', 'Photos du match du 21 mars 2025', '/placeholder.svg?height=300&width=400', 'image', 'matches'),
('Match Seniors Féminines vs Chenôve', 'Photos du match du 10 mars 2025', '/placeholder.svg?height=300&width=400', 'image', 'matches'),
('Match U15 Masculins vs Genlis', 'Photos du match du 28 février 2025', '/placeholder.svg?height=300&width=400', 'image', 'matches'),
('Match U13 Féminines vs Fontaine', 'Photos du match du 15 février 2025', '/placeholder.svg?height=300&width=400', 'image', 'matches'),
('Tournoi des jeunes 2025', 'Photos du tournoi des jeunes', '/placeholder.svg?height=300&width=400', 'image', 'events'),
('Stage de perfectionnement', 'Photos du stage de perfectionnement', '/placeholder.svg?height=300&width=400', 'image', 'events'),
('Fête du club 2024', 'Photos de la fête du club', '/placeholder.svg?height=300&width=400', 'image', 'events'),
('Équipe Seniors Masculins 2024-2025', 'Photo officielle de l''équipe', '/placeholder.svg?height=300&width=400', 'image', 'teams'),
('Équipe Seniors Féminines 2024-2025', 'Photo officielle de l''équipe', '/placeholder.svg?height=300&width=400', 'image', 'teams'),
('Highlights Seniors Masculins vs BC Dijon', 'Résumé vidéo du match', '/placeholder.svg?height=300&width=400', 'video', 'matches'),
('Interview du coach après la victoire', 'Interview de Thomas Dubois', '/placeholder.svg?height=300&width=400', 'video', 'interviews'),
('Résumé du tournoi des jeunes', 'Les meilleurs moments du tournoi', '/placeholder.svg?height=300&width=400', 'video', 'events');

-- Configurer les politiques de sécurité (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils

-- Politique pour permettre aux utilisateurs de voir leur propre profil
-- CREATE POLICY "Users can view their own profile" ON profiles
-- FOR SELECT USING (auth.uid() = user_id);
--   ------------ Correctly wrapped auth.uid() in a SELECT statement.
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);  

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- Politique pour permettre aux administrateurs de voir tous les profils
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Politique pour permettre aux administrateurs de mettre à jour tous les profils
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Politiques pour les profils (visibles par tous les utilisateurs authentifiés)
CREATE POLICY "Les profils sont visibles par tous les utilisateurs authentifiés" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- Politiques pour les équipes (visibles par tous)
CREATE POLICY "Les équipes sont visibles par tous"
ON public.teams FOR SELECT 
TO anon, authenticated 
USING (true);

-- Politique pour insérer des équipes (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent insérer des équipes"
ON public.teams FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour mettre à jour des équipes (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent mettre à jour des équipes"
ON public.teams FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour supprimer des équipes (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent supprimer des équipes"
ON public.teams FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politiques pour les actualités (visibles par tous)
CREATE POLICY "Les actualités sont visibles par tous" 
ON public.news FOR SELECT 
TO anon, authenticated 
USING (true);

-- Politique pour insérer des actualités (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent insérer des actualités"
ON public.news FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour mettre à jour des actualités (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent mettre à jour des actualités"
ON public.news FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour supprimer des actualités (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent supprimer des actualités"
ON public.news FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);


-- Politiques pour les événements (visibles par tous)
CREATE POLICY "Les événements sont visibles par tous" 
ON public.events FOR SELECT 
TO anon, authenticated 
USING (true);

-- Politique pour insérer des événements (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent insérer des événements"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour mettre à jour des événements (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent mettre à jour des événements"
ON public.events FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour supprimer des événements (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent supprimer des événements"
ON public.events FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);


-- Politiques pour les médias (visibles par tous)
CREATE POLICY "Les médias sont visibles par tous" 
ON public.media FOR SELECT 
TO anon, authenticated 
USING (true);

-- Politique pour insérer des médias (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent insérer des médias"
ON public.media FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour mettre à jour des médias (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent mettre à jour des médias"
ON public.media FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour supprimer des médias (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent supprimer des médias"
ON public.media FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);


-- Politiques pour les matchs (visibles par tous)
CREATE POLICY "Les matchs sont visibles par tous" 
ON public.matches FOR SELECT 
TO anon, authenticated 
USING (true);

-- Politique pour insérer des matchs (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent insérer des matchs"
ON public.matches FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour mettre à jour des matchs (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent mettre à jour des matchs"
ON public.matches FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique pour supprimer des matchs (seulement pour les administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent supprimer des matchs"
ON public.matches FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);


-- Fonction pour créer automatiquement un profil lors de l'inscription d'un utilisateur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, first_name, last_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'role', 'member')
  );
  return new;
end;
$$;

-- Trigger pour appeler la fonction lors de l'insertion d'un nouvel utilisateur
-- (Supprime d'abord le trigger s'il existe)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fonction pour supprimer le profil lors de la suppression d'un utilisateur
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.profiles WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour appeler la fonction lors de la suppression d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_deletion();

-- Fonction pour mettre à jour le profil lors de la mise à jour d'un utilisateur
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET first_name = NEW.raw_user_meta_data->>'first_name',
      last_name = NEW.raw_user_meta_data->>'last_name',
      role = COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  WHERE user_id = OLD.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour appeler la fonction lors de la mise à jour d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
