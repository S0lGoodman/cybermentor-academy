import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Schema for student invitation
const studentInviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const studentsRouter = createTRPCRouter({
  invite: protectedProcedure
    .input(studentInviteSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (!ctx.session?.user?.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can invite students",
        });
      }

      try {
        // Send invite email
        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(input.email);

        if (inviteError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to send invite: ${inviteError.message}`,
          });
        }

        // Wait a moment to ensure the user is created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Try to get the user ID
        const { data } = await supabaseAdmin.auth.admin.listUsers();
        
        if (!data || !data.users) {
          console.warn('Could not fetch users list');
          return { success: true };
        }
        
        // Find the user by email
        const user = data.users.find(u => u.email === input.email);
        
        if (user) {
          // Update user metadata
          await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: {
              name: input.name,
              is_new_user: true
            }
          });
          
          // Create profile
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: user.id,
              email: input.email,
              name: input.name,
              role: 'student',
              status: 'invited',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        return { success: true };
      } catch (error: any) {
        console.error('Student invitation error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to invite student",
        });
      }
    }),
});
