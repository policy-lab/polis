ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN;