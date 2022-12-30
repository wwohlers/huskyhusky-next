import { createTextFieldValidator } from "../validation";

export const subjectValidator = createTextFieldValidator(1, 100);
export const bodyValidator = createTextFieldValidator(1, 100000);