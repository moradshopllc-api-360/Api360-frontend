# TypeScript Generic Nesting Guide

## Overview

This guide documents proper patterns for TypeScript generic type nesting to prevent parsing errors and ensure type safety throughout the codebase.

## Common Issues and Solutions

### Issue 1: Missing Closing Brackets in Nested Generics

**Problem:** Missing closing brackets in nested generic types can cause TypeScript parsing errors.

❌ **Incorrect:**
```typescript
async exportTickets(): Promise<ApiResponse<{ download_url: string }> {
  // Error: Expected ',', got '{'
}
```

✅ **Correct:**
```typescript
async exportTickets(): Promise<ApiResponse<{ download_url: string }>> {
  // Note the double closing brackets: }>>
}
```

### Issue 2: JSX in .ts Files

**Problem:** JSX syntax in `.ts` files instead of `.tsx` files causes parsing errors.

❌ **Incorrect:** `src/lib/query/client.ts`
```typescript
export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  )
}
```

✅ **Correct:** `src/lib/query/client.tsx`
```typescript
export function AppQueryClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  )
}
```

## Best Practices

### 1. Generic Type Patterns

#### Simple API Response Types
```typescript
// Basic response with single type
Promise<ApiResponse<User>>

// Response with inline object type
Promise<ApiResponse<{ download_url: string }>>

// Response with array of objects
Promise<ApiResponse<Array<{ id: string; name: string }>>>

// Nested generics (note the proper bracket closing)
Promise<ApiResponse<PaginatedResponse<SupportTicket>>>
```

#### Complex Nested Types
```typescript
// Multiple levels of nesting
Promise<ApiResponse<{
  tickets: PaginatedResponse<{
    id: string
    status: string
    messages: Array<{
      content: string
      created_at: string
    }>
  }>
}>>
```

### 2. Naming Conventions

#### Component Naming to Avoid Conflicts
When creating wrapper components around existing library components, use descriptive names to avoid naming conflicts:

```typescript
// Instead of this (potential naming conflict)
export function QueryClientProvider({ children }: { children: React.ReactNode }) {}

// Use this (clear and avoids conflicts)
export function AppQueryClientProvider({ children }: { children: React.ReactNode }) {}
```

### 3. Type Safety Patterns

#### API Client Method Signatures
```typescript
// Always close all generic brackets properly
async getMessages(ticketId: string): Promise<ApiResponse<PaginatedResponse<{
  id: string
  ticket_id: string
  message: string
  is_from_user: boolean
  created_at: string
}>>>

// For complex return types, consider extracting to a type alias
type MessageListResponse = ApiResponse<PaginatedResponse<Message>>
async getMessages(ticketId: string): Promise<MessageListResponse>
```

## Validation Checklist

Before committing TypeScript code changes, verify:

1. **Bracket Matching**: All opening `<` have corresponding closing `>`
2. **Nested Generics**: Count brackets carefully for nested types
   - `Promise<ApiResponse<{ type }>>` needs 2 closing brackets `>>`
   - `Promise<ApiResponse<Array<{ type }>>>` needs 3 closing brackets `>>>`
3. **File Extensions**: JSX content must be in `.tsx` files
4. **TypeScript Compilation**: Run `npx tsc --noEmit` to check for parsing errors
5. **Build Process**: Run `npm run build` to ensure Turbopack can parse correctly

## Common Patterns in This Codebase

### API Response Patterns
```typescript
// Single object response
Promise<ApiResponse<User>>

// Array response
Promise<ApiResponse<User[]>>

// Paginated response
Promise<ApiResponse<PaginatedResponse<User>>>

// Inline object response
Promise<ApiResponse<{ download_url: string }>>
```

### Query Hook Patterns
```typescript
// Basic query hook
function useUserProfile(): UseQueryResult<ApiResponse<User>>

// Mutation hook
function useUpdateProfile(): UseMutationResult<
  ApiResponse<User>,
  Error,
  Partial<User>
>
```

## Debugging Tips

### When You See "Expected ',' got '{'" Errors

1. Check for missing closing brackets in the preceding generic type
2. Look specifically for patterns like `Type<{` without proper `}>` closing
3. Use an editor with TypeScript support to highlight bracket pairs

### When TypeScript Compilation Fails

1. Run `npx tsc --noEmit` to get specific error messages
2. Check line numbers mentioned in error messages
3. Look for JSX syntax in `.ts` files that should be `.tsx`

## File Changes Made

This guide was created in response to the following fixes:

1. **Fixed**: `src/lib/api/support.ts:171` - Added missing closing `>` in `Promise<ApiResponse<{ download_url: string }>>`
2. **Fixed**: `src/lib/query/client.ts` → `src/lib/query/client.tsx` - Moved JSX content to `.tsx` file and renamed component to avoid conflicts

## Preventive Measures

1. **Editor Configuration**: Use editors with TypeScript support and bracket matching
2. **Linting Rules**: Consider ESLint rules that catch bracket mismatches
3. **Code Reviews**: Pay special attention to complex generic type definitions
4. **Type Safety**: Prefer type aliases for very complex nested types
5. **Testing**: Always run TypeScript compilation before committing changes

---

**Last Updated:** 2025-01-12
**Related Files:** `/src/lib/api/support.ts`, `/src/lib/query/client.tsx`