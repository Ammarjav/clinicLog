-- Replace the existing users_insert_signup policy with:
CREATE POLICY "users_insert_signup" ON users
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id AND clinic_id IS NULL);