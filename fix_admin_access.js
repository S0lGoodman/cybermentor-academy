// This script will help fix admin access issues
// Run this with: node fix_admin_access.js

const { createClient } = require('@supabase/supabase-js');

// Replace these with your actual Supabase URL and service role key
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('Example: SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_ROLE_KEY=your-key node fix_admin_access.js');
  process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixAdminAccess() {
  console.log('Starting admin access fix...');

  try {
    // 1. Get all users with @cybermentor.ma email domain
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }

    const adminUsers = users.users.filter(user => 
      user.email && user.email.endsWith('@cybermentor.ma')
    );

    console.log(`Found ${adminUsers.length} potential admin users with @cybermentor.ma email domain`);

    // 2. Update each admin user's metadata and profile
    for (const user of adminUsers) {
      console.log(`Processing user: ${user.email}`);

      // Update user metadata
      const { error: metadataError } = await supabase.auth.admin.updateUserById(
        user.id,
        { 
          user_metadata: { 
            ...user.user_metadata,
            role: 'admin' 
          } 
        }
      );

      if (metadataError) {
        console.error(`Error updating metadata for ${user.email}:`, metadataError);
        continue;
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: 'admin',
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error(`Error updating profile for ${user.email}:`, updateError);
        } else {
          console.log(`Updated profile for ${user.email}`);
        }
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email,
            role: 'admin',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error(`Error creating profile for ${user.email}:`, insertError);
        } else {
          console.log(`Created profile for ${user.email}`);
        }
      }
    }

    console.log('Admin access fix completed successfully!');
  } catch (error) {
    console.error('Error fixing admin access:', error);
  }
}

fixAdminAccess();
