import { UserLoginData, UserRegistrationData } from "@/app/types/user";

export function userRegistrationValidator(data: UserRegistrationData): [boolean, ErrorObject] {
    let errors: ErrorObject = {};
    if (!data.email) {
      errors.title = "Email is required";
      //TODO: Add email validation
    }
    if (!data.password) {
      errors.author = "Password is required";
    }
    if(!data.name) {
        errors.name = "Name is required";
    }
    const hasErrors = Object.keys(errors).length !== 0;
  
    return [hasErrors, errors]
  }
  
  export function userLoginValidator(
    data: UserLoginData
  ): [boolean, ErrorObject] {
    let errors: ErrorObject = {};
    if (!data.email) {
      errors.email = "Email is required";
      //TODO: Add email validation
    }
    if (!data.password) {
      errors.password = "Password is required";
    }
    const hasErrors = Object.keys(errors).length !== 0;
  
    return [hasErrors, errors];
  }