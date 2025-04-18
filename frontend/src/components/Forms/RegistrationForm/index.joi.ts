import Joi from "joi";
import { IRegistration } from "@/common/interfaces/auth.interfaces";

export const schema = Joi.object<IRegistration>({
    email: Joi.string()
        .email({ tlds: { allow: false } }) // Disable TLD validation
        .required()
        .messages({
            "string.email": "Invalid email format",
            "string.empty": "Email is required",
            "any.required": "Email is required"
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.empty": "Password is required",
            "any.required": "Password is required"
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            "any.only": "Passwords must match",
            "string.empty": "Password confirmation is required",
            "any.required": "Password confirmation is required"
        })
});