import { z } from 'zod';

// Common validation schemas
export const VALIDATION_SCHEMAS = {
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  age: z.number().min(1).max(120, 'Age must be between 1 and 120'),
  height: z.number().min(50).max(250, 'Height must be between 50-250 cm'),
  weight: z.number().min(20).max(300, 'Weight must be between 20-300 kg'),
  
  // Complex schemas
  emergencyContact: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    relationship: z.string().min(1, 'Relationship is required')
  }),
  
  guardian: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    email: z.string().email('Please enter a valid email'),
    relationship: z.enum(['parent', 'child', 'spouse', 'sibling', 'caretaker', 'other']),
    accessLevel: z.enum(['full', 'limited', 'emergency'])
  })
};

// Common form field configurations
export const FORM_FIELDS = {
  personalInfo: [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
    { name: 'age', label: 'Age', type: 'number', placeholder: '25', min: 1, max: 120 },
    { name: 'height', label: 'Height (cm)', type: 'number', placeholder: '170', min: 50, max: 250 },
    { name: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70', min: 20, max: 300 }
  ],
  
  contact: [
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '1234567890' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
    { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main St' }
  ],
  
  medical: [
    { name: 'bloodType', label: 'Blood Type', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    { name: 'allergies', label: 'Allergies', type: 'textarea', placeholder: 'List any allergies...' },
    { name: 'medications', label: 'Current Medications', type: 'textarea', placeholder: 'List current medications...' },
    { name: 'conditions', label: 'Medical Conditions', type: 'textarea', placeholder: 'List any medical conditions...' }
  ]
};

// Common select options
export const SELECT_OPTIONS = {
  gender: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ],
  
  bloodTypes: [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ],
  
  relationships: [
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'caretaker', label: 'Caretaker' },
    { value: 'other', label: 'Other' }
  ],
  
  accessLevels: [
    { value: 'full', label: 'Full Access', description: 'Can view and manage all health records and appointments' },
    { value: 'limited', label: 'Limited Access', description: 'Can view basic health information and emergency contacts' },
    { value: 'emergency', label: 'Emergency Only', description: 'Access only during medical emergencies' }
  ]
};

// Common form layouts
export const FORM_LAYOUTS = {
  twoColumn: "grid grid-cols-2 gap-4",
  singleColumn: "space-y-4",
  threeColumn: "grid grid-cols-3 gap-4",
  responsive: "grid grid-cols-1 md:grid-cols-2 gap-4"
};

// Form styling constants
export const FORM_STYLES = {
  container: "space-y-6",
  section: "space-y-4",
  fieldGroup: "space-y-2",
  label: "text-sm font-medium text-gray-700",
  input: "mt-1",
  description: "text-sm text-gray-600",
  error: "text-sm text-red-600",
  
  card: {
    base: "p-6 border border-gray-200 rounded-lg",
    selected: "p-6 border-teal-500 bg-teal-50 rounded-lg",
    hover: "p-6 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors cursor-pointer"
  },
  
  button: {
    primary: "bg-teal-600 hover:bg-teal-700 text-white",
    secondary: "border border-gray-300 hover:bg-gray-50",
    selected: "bg-teal-600 hover:bg-teal-700 text-white",
    unselected: "border border-gray-300 hover:bg-teal-50 hover:border-teal-300"
  }
};

// Helper functions
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
};

export const validateForm = (data: any, schema: z.ZodSchema): { isValid: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path.join('.')] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

export const createDefaultValues = (fields: any[]): Record<string, any> => {
  const defaults: Record<string, any> = {};
  fields.forEach(field => {
    switch (field.type) {
      case 'checkbox':
        defaults[field.name] = false;
        break;
      case 'number':
        defaults[field.name] = '';
        break;
      default:
        defaults[field.name] = '';
    }
  });
  return defaults;
}; 