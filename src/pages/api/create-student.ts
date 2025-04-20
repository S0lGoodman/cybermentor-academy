import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Log environment variables for debugging (don't include this in production)
console.log('API Environment:', {
  supabaseUrl: supabaseUrl,
  hasServiceKey: !!supabaseServiceKey
});

// Create client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set proper content type
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the request body for debugging
    console.log('Request body:', req.body);

    // Parse the request body if it's a string
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { firstName, lastName, phoneNumber } = body;

    // Log the parsed values
    console.log('Parsed values:', { firstName, lastName, phoneNumber });

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Generate email and password
    const initial = firstName.charAt(0).toLowerCase();
    const formattedLastName = lastName.toLowerCase();
    const email = `${initial}.${formattedLastName}@cybermentor.ma`;
    const password = `${firstName.toLowerCase()}123!`;

    // Format phone number for WhatsApp URL
    let whatsappUrl = null;
    if (phoneNumber) {
      let phone = phoneNumber.replace(/\D/g, '');
      if (phone.startsWith('0')) {
        phone = '212' + phone.substring(1);
      } else if (!phone.startsWith('212')) {
        phone = '212' + phone;
      }
      whatsappUrl = `https://wa.me/${phone}`;
    }

    // Step 1: Create the auth user
    console.log('Creating auth user with email:', email);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(500).json({ error: `Failed to create auth user: ${authError.message}` });
    }

    if (!authData.user) {
      console.error('No user data returned from auth creation');
      return res.status(500).json({ error: 'Failed to create auth user: No user data returned' });
    }

    const userId = authData.user.id;
    console.log('Auth user created with ID:', userId);

    // Step 2: Insert into students table
    console.log('Inserting into students table...');
    const { error: studentError } = await supabase
      .from('students')
      .insert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber || null,
        whatsapp_url: whatsappUrl,
        status: 'active',
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (studentError) {
      console.error('Error inserting into students table:', studentError);

      // Try to delete the auth user if student creation fails
      await supabase.auth.admin.deleteUser(userId);

      return res.status(500).json({ error: `Failed to create student record: ${studentError.message}` });
    }

    console.log('Student created successfully!');

    // Return the created user info
    return res.status(200).json({
      success: true,
      student: {
        id: userId,
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phoneNumber || '',
        whatsappUrl: whatsappUrl || ''
      }
    });
  } catch (error: any) {
    console.error('Server error:', error);

    // Create a safe error response
    const errorResponse = {
      error: error.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    // Log the error response we're about to send
    console.log('Sending error response:', errorResponse);

    // Send a properly formatted JSON response
    return res.status(500).json(errorResponse);
  }
}
