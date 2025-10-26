/**
 *
 * @param classes - A list of class names to combine.
 * @description Combines multiple class names into a single string, filtering out any falsy values.
 * Example: clsx('class1', false, 'class2') returns 'class1 class2'.
 * @returns
 */
export function clsx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
