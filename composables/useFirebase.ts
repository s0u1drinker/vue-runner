export const useFirebase = () => {
  const { $db, $auth } = useNuxtApp()
  return { db: $db, auth: $auth }
}