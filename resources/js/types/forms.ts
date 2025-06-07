// types/forms.ts
export interface CreateRestaurantForm {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: string;
  cuisine_type: string;
}

export interface UpdateRestaurantForm extends CreateRestaurantForm {
  id: number;
}

// Add other form types as needed
export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}