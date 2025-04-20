import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set proper headers for CORS and content type
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body safely
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      console.error('Error parsing request body:', e);
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { email, firstName, lastName, phoneNumber } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate a UUID for the user
    const userId = uuidv4();
    console.log('Generated user ID:', userId);

    // Generate a simple password
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

    // Current timestamp
    const now = new Date().toISOString();

    // First insert into students table
    console.log('Inserting into students table...');
    const { error: studentError } = await supabaseAdmin
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
        created_at: now,
        updated_at: now
      });

    if (studentError) {
      console.error('Student error:', studentError);
      return res.status(500).json({ error: `Failed to create student record: ${studentError.message}` });
    }

    console.log('Student record created successfully!');

    // Then create the user in auth system
    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      },
      app_metadata: {
        provider: "email",
        role: "student"
      },
      id: userId
    });

    if (authError) {
      console.error('Auth error:', authError);

      // Try to delete the student record since we couldn't create the auth user
      console.log('Deleting student record due to auth user creation failure...');
      await supabaseAdmin
        .from('students')
        .delete()
        .eq('id', userId);

      return res.status(500).json({ error: `Auth error: ${authError.message}` });
    }

    console.log('Auth user created successfully!');

    // Return success response
    const responseData = {
      success: true,
      user: {
        id: userId,
        email,
        password,
        firstName,
        lastName
      }
    };

    console.log('Sending success response');
    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
}
