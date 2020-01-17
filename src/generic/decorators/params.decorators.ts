import { createParamDecorator } from "@nestjs/common";

export const Id = createParamDecorator((data, req) => {
  return req.params.id;
});
