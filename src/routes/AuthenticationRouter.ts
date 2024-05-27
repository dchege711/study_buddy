import { sendAccountValidationLink, SendAccountValidationLinkParams, sendResetLink, ResetLinkParams, resetPassword } from '../models/LogInUtilities';
import { router, publicProcedure } from '../trpc';

/**
 * @description This router handles all authentication-related FETCH requests.
 */
export const authRouter = router({
   sendValidationEmail: publicProcedure
    .input((params: unknown) => params as SendAccountValidationLinkParams)
    .mutation(({ input }) => {
      return sendAccountValidationLink(input);
    }),

   sendResetPasswordLink: publicProcedure
    .input((params: unknown) => params as ResetLinkParams)
    .mutation(({ input }) => {
      return sendResetLink(input);
    }),
});
