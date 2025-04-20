import { supabase } from './supabase';

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
    const email = `${initial}.${formattedLastName}@cybermentor.ma`;
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

    // SIMULATION: Instead of calling the API, we'll simulate a successful response
    console.log('Simulating student creation...');

    // Generate a random ID
    const userId = crypto.randomUUID();

    // Simulate a delay to make it feel like an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Student simulated successfully!');

    // Return the simulated user info
    return {
      success: true,
      student: {
        id: userId,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
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
