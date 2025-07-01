import { useFirestore } from 'vuefire'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
/**
 * Возвращает из БД данные по наименованию коллекции.
 * @param storeCollection Наименование коллекции.
 * @param order Сортировка по полю.
 * @returns Данные из БД или пустой массив.
 */
export async function getDataFromDB<T>(storeCollection: string, order?: { field: keyof T, direction: 'desc' | 'asc' }): Promise<T[]> {
  const db = useFirestore()
  const q = order ? query(collection(db, storeCollection), orderBy(String(order.field), order.direction)) : query(collection(db, storeCollection))
  const returnData: T[] = []

  try {
    const querySnapshot = await getDocs(q)

    // Если получен пустой массив, то выбрасывается ошибка. Здесь всегда должны приходить данные.
    if (!querySnapshot.docs.length) {
      console.error(`Получен пустой массив <${storeCollection}>.`)
    } else {
      // Извлекаем данные, попутно добавляя идентификатор документа.
      querySnapshot.forEach(doc => returnData.push({ id: doc.id, ...doc.data() } as T))
    }
  } catch (error) {
    console.error(`Ошибка при загрузке данных из коллекции <${storeCollection}>: ${error}`)
  }

  return returnData
}