import { SetMetadata } from '@nestjs/common';
export const IGNORE_RESPONSE_KEY = Symbol('IGNORE_RESPONSE_KEY');
export const IgnoreCoreRes = () => SetMetadata(IGNORE_RESPONSE_KEY, true);
