// Emails allowed to access the /admin moderation dashboard.
// Add more emails here if you ever want a co-moderator.
export const ADMIN_EMAILS = ['nkapur2211@gmail.com']

export const isAdminEmail = (email?: string | null): boolean =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase())
