export const avatarUrl = (name: string): string =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0d2212&textColor=22c55e&fontSize=40`
