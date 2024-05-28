import { sendAccountValidationLink, SendAccountValidationLinkParams, sendResetLink, ResetLinkParams, resetPassword } from '../models/LogInUtilities';
import { router, publicProcedure } from '../trpc';

/**
 * @description This router handles all authentication-related FETCH requests.
 */
export const authRouter = router({
});
