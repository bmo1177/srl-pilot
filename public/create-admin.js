// This script provides instructions for creating an admin user in Supabase
// No need to run this script - just follow the instructions below

console.log('=== HOW TO CREATE AN ADMIN USER ===');
console.log('Since this application uses Supabase, you need to:');
console.log('');
console.log('1. Go to https://app.supabase.com/ and sign in');
console.log('2. Select your project');
console.log('3. Go to Authentication > Users');
console.log('4. Click "Add User" and create a user with:');
console.log('   - Email: admin@example.com (or your preferred email)');
console.log('   - Password: Admin123! (or your preferred password)');
console.log('5. Copy the new user\'s ID (UUID)');
console.log('6. Go to SQL Editor');
console.log('7. Run the following SQL (replace USER_ID with the copied UUID):');
console.log('');
console.log(`
-- Create the is_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- This makes the user with the specified ID an admin
  RETURN user_id = 'cb2ccd2c-911d-4856-a883-c4d3e14060b4';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`);
console.log('');
console.log('8. Now you can log in to the admin panel with:');
console.log('   - Email: admin@example.com (or the email you chose)');
console.log('   - Password: Admin123! (or the password you chose)');
console.log('');
console.log('=== EXISTING ADMIN CREDENTIALS ===');
console.log('If you already have admin credentials, use those to log in.');
console.log('The typical default admin credentials are:');
console.log('   - Email: admin@example.com');
console.log('   - Password: Admin123!');
