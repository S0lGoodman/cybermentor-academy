import { supabaseAdmin } from './supabase-admin';

interface CreateStudentParams {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

interface CreateStudentResult {
  success: boolean;
  student?: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    whatsappUrl: string;
  };
  error?: string;
}

export async function createStudent(params: CreateStudentParams): Promise<CreateStudentResult> {
  try {
    const { firstName, lastName, phoneNumber } = params;

    if (!firstName || !lastName) {
      return { 
        success: false, 
        error: 'First name and last name are required' 
      };
    }

    // Generate email and password
    const initial = firstName.charAt(0).toLowerCase();
    const formattedLastName = lastName.toLowerCase();
    const email = `${initial}.${formattedLastName}@example.com`;
    const password = `${firstName.toLowerCase()}123!`;

    // Format phone number for WhatsApp URL
    let whatsappUrl = '';
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
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
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
      return { 
        success: false, 
        error: `Failed to create auth user: ${authError.message}` 
      };
    }

    if (!authData.user) {
      console.error('No user data returned from auth creation');
      return { 
        success: false, 
        error: 'Failed to create auth user: No user data returned' 
      };
    }

    const userId = authData.user.id;
    console.log('Auth user created with ID:', userId);

    // Step 2: Insert into students table
    console.log('Inserting into students table...');
    const { error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber || null,
        whatsapp_url: whatsappUrl || null,
        status: 'active',
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (studentError) {
      console.error('Error inserting into students table:', studentError);
      
      // Try to delete the auth user if student creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      
      return { 
        success: false, 
        error: `Failed to create student record: ${studentError.message}` 
      };
    }

    console.log('Student created successfully!');

    // Return the created user info
    return {
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
    };
  } catch (error: any) {
    console.error('Student creation error:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
}
