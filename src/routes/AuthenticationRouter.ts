import { RegisterUserAndPasswordParams, registerUserAndPassword, sendAccountValidationLink, SendAccountValidationLinkParams, sendResetLink, ResetLinkParams, resetPassword } from '../models/LogInUtilities';
import { router, publicProcedure } from '../trpc';

/**
 * @description This router handles all authentication-related FETCH requests.
 */
export const authRouter = router({
  registerUser: publicProcedure
    .input((params: unknown) => params as RegisterUserAndPasswordParams)
    .mutation(({ input }) => {
      return registerUserAndPassword(input);
    }),

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
