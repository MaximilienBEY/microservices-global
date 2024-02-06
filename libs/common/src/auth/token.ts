export const generateToken = (size: number): string => {
  return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"
    .repeat(60)
    .split("")
    .sort(() => Math.random() - 0.5)
    .slice(0, size)
    .join("")
}
