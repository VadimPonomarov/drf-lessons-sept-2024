import Joi from "joi";

import { IDummyAuth } from "@/common/interfaces/dummy.interfaces.ts";

export const schema = Joi.object<IDummyAuth>({
    username: Joi.string().required().messages({
        "string.base": "Username must be a string",
        "any.required": "Username is required",
        "string.empty": "Username is not allowed to be empty",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password is not allowed to be empty",
    }),
    expiresInMins: Joi.number().valid(30, 60).required().messages({
        "any.required": "ExpiresInMins is required",
        "number.base": "ExpiresInMins must be a number",
        "any.only": "ExpiresInMins must be either 30 or 60",
        "string.empty": "ExpiresInMins is not allowed to be empty",
    }),
});


