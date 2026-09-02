import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아니에요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해 주세요."),
    email: z.string().email("올바른 이메일 형식이 아니에요."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 해요."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호 확인이 일치하지 않아요.",
    path: ["passwordConfirm"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
