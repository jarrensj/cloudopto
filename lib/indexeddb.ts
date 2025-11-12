// IndexedDB utility for storing large data like images
const DB_NAME = 'cloudopto-edit'
const STORE_NAME = 'editSessions'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

export async function storeEditSession(data: {
  imageFile: File
  prompt: string
  promptId: string
  customPrompt: string
}): Promise<void> {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const request = store.put(data, 'current')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getEditSession(): Promise<{
  imageFile: File
  prompt: string
  promptId: string
  customPrompt: string
} | null> {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readonly')
  const store = transaction.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const request = store.get('current')
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export async function clearEditSession(): Promise<void> {
  const db = await openDB()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const request = store.delete('current')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

