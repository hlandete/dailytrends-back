export enum HttpMessages {
  NO_ACTIVE_LICENSE = "No active license was found",
  NO_ACTIVE_PLATFORM = "No active platform was found",

  LICENSE_CREATED = "License was created successfully",
  PLATFORM_CREATED = "Platform was created successfully",

  LINCESE_NOT_FOUND = "License not found",
  PLATFORM_NOT_FOUND = "Platform not found",
  ADMIN_NOT_FOUND = "Admin not found",
  APP_NOT_FOUND = "App not found",

  USER_IS_ASSIGNED = "This user is already assigned to a license",
  LICENSE_HAS_USER = "This license is already used by another user",

  LICENSE_EXISTS = "License already exists for this user",
  PLATFORM_EXISTS = "Platform already exists for this company",

  LICENSE_EXPIRED = "License is expired",
  PLATFORM_EXPIRED = "Platform is expired"
}
