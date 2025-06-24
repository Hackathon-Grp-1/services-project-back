import { ValidationError } from 'class-validator';

export interface DtoErrorDetail {
  field: string;
  value?: string;
  messages?: string[];
  children?: DtoErrorDetail[];
}

export const buildErrors = (errors: ValidationError[]): DtoErrorDetail[] => {
  return errors.map((error) => {
    const errorDetail: DtoErrorDetail = {
      field: error.property,
    };

    if (error.constraints) {
      errorDetail.messages = Object.values(error.constraints);
    }

    if (error.children?.length) {
      errorDetail.children = buildErrors(error.children);
    } else {
      errorDetail.value = error.value as string;
    }

    return errorDetail;
  });
};
