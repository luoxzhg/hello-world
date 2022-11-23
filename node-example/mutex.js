const UNLOCKED = 0
const LOCKED = 1

class Mutex {
   constructor(shared, index) {
      this.shared = shared
      this.index = index
   }

   acquire() {
      if (UNLOCKED === Atomics.compareExchange(this.shared, this.index, UNLOCKED, LOCKED)) {
         return
      }
      Atomics.wait(this.shared, this.index, LOCKED)
      this.acquire()
   }

   release() {
      if (LOCKED !== Atomics.compareExchange(this.shared, this.index, LOCKED, UNLOCKED)) {
         throw new Error('was not acquired')
      }
      Atomics.notify(this.shared, this.index, 1)
   }

   exec(fn) {
      this.acquire()
      try {
         return fn()
      } finally {
         this.release()
      }
   }
}
