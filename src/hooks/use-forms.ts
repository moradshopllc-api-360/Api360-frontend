'use client'

import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthActions } from './use-auth'
import { useAIAutowire } from './use-ai-autowire'
import { useRouter } from 'next/navigation'
import {
  loginSchema,
  registerSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  changePasswordSchema,
  updateProfileSchema,
  createSupportTicketSchema,
  updateSupportTicketSchema,
  addTicketMessageSchema,
  createUserSchema,
  updateUserSchema
} from '@/lib/schemas'
import type {
  LoginFormData,
  RegisterFormData,
  PasswordResetRequestFormData,
  PasswordResetConfirmFormData,
  ChangePasswordFormData,
  UpdateProfileFormData,
  CreateSupportTicketFormData,
  UpdateSupportTicketFormData,
  AddTicketMessageFormData,
  CreateUserData,
  UpdateUserData
} from '@/lib/schemas'

// Authentication form hooks
export function useLoginForm() {
  const { login } = useAuthActions()
  const { execute, loading } = useAIAutowire()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
    }
  }

  return {
    form,
    onSubmit,
    loading,
    isSubmitting: form.formState.isSubmitting
  }
}

export function useRegisterForm() {
  const { register } = useAuthActions()
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: 'crewmember'
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.email, data.password, data.name, data.role)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' }
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting
  }
}

export function usePasswordResetRequestForm() {
  const { resetPassword } = useAuthActions()

  const form = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: ''
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: PasswordResetRequestFormData) => {
    try {
      await resetPassword(data.email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Password reset failed' }
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting
  }
}

export function usePasswordResetConfirmForm(token: string) {
  const router = useRouter()
  const { execute, loading } = useAIAutowire()

  const form = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: PasswordResetConfirmFormData) => {
    try {
      const spec = {
        method: 'POST' as const,
        path: '/auth/password-reset/confirm',
        doc: {
          title: 'Confirm Password Reset',
          description: 'Reset password with token'
        }
      }

      await execute(spec, {
        token: data.token,
        new_password: data.newPassword
      })

      router.push('/auth/login?message=password-reset-success')
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Password reset failed' }
    }
  }

  return {
    form,
    onSubmit,
    loading,
    isSubmitting: form.formState.isSubmitting
  }
}

export function useChangePasswordForm() {
  const { changePassword } = useAuthActions()

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Password change failed' }
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting
  }
}

// Profile form hooks
export function useUpdateProfileForm() {
  const { updateProfile } = useAuthActions()

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      avatar_url: ''
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile(data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Profile update failed' }
    }
  }

  const reset = () => {
    form.reset()
  }

  return {
    form,
    onSubmit,
    reset,
    isSubmitting: form.formState.isSubmitting
  }
}

// Support ticket form hooks
export function useCreateSupportTicketForm() {
  const { execute } = useAIAutowire()
  const router = useRouter()

  const form = useForm<CreateSupportTicketFormData>({
    resolver: zodResolver(createSupportTicketSchema),
    defaultValues: {
      subject: '',
      message: '',
      priority: 'medium'
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: CreateSupportTicketFormData) => {
    try {
      const spec = {
        method: 'POST' as const,
        path: '/support/tickets',
        doc: {
          title: 'Create Support Ticket',
          description: 'Create a new support ticket'
        }
      }

      await execute(spec, data)

      // Redirect to support tickets page
      router.push('/dashboard/support')
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create support ticket' }
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting
  }
}

export function useUpdateSupportTicketForm(ticketId: string) {
  const { execute } = useAIAutowire()

  const form = useForm<UpdateSupportTicketFormData>({
    resolver: zodResolver(updateSupportTicketSchema),
    defaultValues: {
      status: undefined,
      message: ''
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: UpdateSupportTicketFormData) => {
    try {
      const spec = {
        method: 'PATCH' as const,
        path: `/support/tickets/${ticketId}`,
        doc: {
          title: 'Update Support Ticket',
          description: 'Update support ticket status or details'
        }
      }

      await execute(spec, data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update support ticket' }
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting
  }
}

export function useAddTicketMessageForm(ticketId: string) {
  const { execute } = useAIAutowire()

  const form = useForm<AddTicketMessageFormData>({
    resolver: zodResolver(addTicketMessageSchema),
    defaultValues: {
      message: '',
      attachments: []
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: AddTicketMessageFormData) => {
    try {
      const spec = {
        method: 'POST' as const,
        path: `/support/tickets/${ticketId}/messages`,
        doc: {
          title: 'Add Ticket Message',
          description: 'Add message to support ticket'
        }
      }

      const formData = new FormData()
      formData.append('message', data.message)

      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach(file => {
          formData.append('attachments', file)
        })
      }

      await execute(spec, formData)

      // Reset form after successful submission
      form.reset({ message: '', attachments: [] })
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add message' }
    }
  }

  const handleFileChange = (files: File[]) => {
    form.setValue('attachments', files, { shouldValidate: true })
  }

  return {
    form,
    onSubmit,
    handleFileChange,
    isSubmitting: form.formState.isSubmitting
  }
}

// Admin form hooks
export function useCreateUserForm() {
  const { execute } = useAIAutowire()
  const router = useRouter()

  const form = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: 'crewmember',
      is_active: true
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: CreateUserData) => {
    try {
      const spec = {
        method: 'POST' as const,
        path: '/admin/users',
        doc: {
          title: 'Create User',
          description: 'Create new user account (admin only)'
        }
      }

      await execute(spec, data)

      // Redirect to users list
      router.push('/dashboard/admin/users')
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create user' }
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting
  }
}

export function useUpdateUserForm(userId: string, defaultValues?: Partial<UpdateUserData>) {
  const { execute } = useAIAutowire()

  const form = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: undefined,
      is_active: undefined,
      ...defaultValues
    },
    mode: 'onBlur'
  })

  const onSubmit = async (data: UpdateUserData) => {
    try {
      const spec = {
        method: 'PATCH' as const,
        path: `/admin/users/${userId}`,
        doc: {
          title: 'Update User',
          description: 'Update user details (admin only)'
        }
      }

      await execute(spec, data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update user' }
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting
  }
}

// Generic form hook for simple forms
export function useFormWithSchema<T extends z.ZodSchema>(
  schema: T,
  defaultValues: Partial<z.infer<T>> = {},
  mode: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all' = 'onBlur'
) {
  type FormData = z.infer<T>

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormData,
    mode
  })

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    reset: form.reset,
    setValue: form.setValue,
    getValues: form.getValues,
    watch: form.watch
  }
}

// Form validation helpers
export function getFormErrorMessage(error: any): string {
  if (!error) return ''

  if (typeof error === 'string') {
    return error
  }

  if (error?.message) {
    return error.message
  }

  return 'An error occurred'
}

export function hasFormError(errors: any, field: string): boolean {
  return !!errors[field]
}

export function getFormError(errors: any, field: string): string {
  return errors[field]?.message || ''
}