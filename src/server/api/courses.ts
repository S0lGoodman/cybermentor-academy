import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const courseCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  phase: z.string(),
  duration: z.string(),
  difficulty: z.string(),
  prerequisites: z.string().optional(),
  thumbnail: z.string().optional(),
  status: z.enum(["draft", "published", "review"]).default("draft"),
});

export const coursesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(courseCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (!ctx.session?.user?.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create courses",
        });
      }

      // Create the course
      const course = await ctx.prisma.course.create({
        data: {
          name: input.name,
          description: input.description,
          phase: input.phase,
          duration: input.duration,
          difficulty: input.difficulty,
          prerequisites: input.prerequisites,
          thumbnail: input.thumbnail,
          status: input.status,
          createdById: ctx.session.user.id,
        },
      });

      return course;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
}); 