-- Categorias por projeto (gerenciáveis pela UI)
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  projeto TEXT NOT NULL,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (projeto, nome)
);

CREATE INDEX IF NOT EXISTS categorias_projeto_idx ON categorias(projeto);

INSERT INTO categorias (projeto, nome) VALUES
  ('casa_rio', 'UM B2'), ('casa_rio', 'Drone'), ('casa_rio', 'Minidrone'),
  ('casa_rio', 'DSLR'),  ('casa_rio', 'SNG'),   ('casa_rio', 'Geradores'),
  ('casa_sp',  'UM B2'), ('casa_sp',  'Drone'), ('casa_sp',  'Minidrone'),
  ('casa_sp',  'DSLR'),  ('casa_sp',  'SNG'),   ('casa_sp',  'Geradores')
ON CONFLICT (projeto, nome) DO NOTHING;

-- Dias do cronograma Rio — array JSONB de inteiros (1..13)
ALTER TABLE items ADD COLUMN IF NOT EXISTS dias JSONB DEFAULT '[]'::jsonb;
