-- Fonction pour tester la connexion à Supabase
-- Crée une fonction RPC qui renvoie simplement le timestamp actuel
CREATE OR REPLACE FUNCTION get_current_timestamp()
RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN NOW();
END;
$$ LANGUAGE plpgsql;

-- Permission pour permettre à l'utilisateur anonyme d'exécuter cette fonction
GRANT EXECUTE ON FUNCTION get_current_timestamp() TO anon;
