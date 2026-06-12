import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envContent = fs.readFileSync(path.resolve('c:/Users/HCL/Desktop/student note/.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing connection to:', supabaseUrl);
  
  // Try fetching one user to see fields
  const { data, error } = await supabase
    .from('sne_users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching from sne_users:', error.message);
  } else {
    console.log('Successfully fetched sample user from sne_users!');
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
      console.log('Sample user data:', data[0]);
    } else {
      console.log('Table sne_users is empty, columns cannot be inspected this way.');
      
      // Let's try inserting a dummy user or fetching database metadata
      console.log('Trying to insert a dummy user to see if it works or which columns it accepts...');
      const dummyId = 'dummy_' + Date.now();
      const { data: inserted, error: insertError } = await supabase
        .from('sne_users')
        .insert({
          clerk_id: dummyId,
          email: 'dummy@test.com',
          full_name: 'Dummy Test'
        })
        .select();
      
      if (insertError) {
        console.error('Insert with clerk_id failed:', insertError.message);
        
        // Let's try inserting with auth_id
        console.log('Trying with auth_id as gen_random_uuid()...');
        const { data: inserted2, error: insertError2 } = await supabase
          .from('sne_users')
          .insert({
            email: 'dummy@test.com',
            full_name: 'Dummy Test'
          })
          .select();
        
        if (insertError2) {
          console.error('Insert with email and name failed:', insertError2.message);
        } else {
          console.log('Insert with email and name succeeded! Columns of sne_users are:', Object.keys(inserted2[0]));
          
          // Cleanup
          await supabase.from('sne_users').delete().eq('id', inserted2[0].id);
        }
      } else {
        console.log('Insert with clerk_id succeeded! Columns of sne_users are:', Object.keys(inserted[0]));
        
        // Cleanup
        await supabase.from('sne_users').delete().eq('id', inserted[0].id);
      }
    }
  }
}

test();
