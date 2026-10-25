/**
 * Custom Hash Table Implementation with Separate Chaining for Collision Resolution.
 * 
 * Demonstrates:
 * 1. Polynomial rolling hash function (Horner's method with prime multiplier 31)
 * 2. Prime modulus table sizing (17 slots initially)
 * 3. Linked collision chains per bucket
 * 4. Metrics: Load Factor (alpha), Collision Count, Bucket distribution
 */

class HashNode {
  constructor(key, value, next = null) {
    this.key = key;
    this.value = value;
    this.next = next;
  }
}

export class HashTable {
  constructor(initialCapacity = 17) {
    this.capacity = initialCapacity;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
    this.collisionCount = 0;
  }

  /**
   * Polynomial rolling hash function
   * hash = (hash * 31 + charCode) % capacity
   */
  hash(key) {
    const stringKey = String(key).toLowerCase().trim();
    let hashVal = 0;
    const prime = 31;
    for (let i = 0; i < stringKey.length; i++) {
      hashVal = (hashVal * prime + stringKey.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hashVal);
  }

  /**
   * Insert a key-value pair into the hash table
   */
  insert(key, value) {
    const index = this.hash(key);
    let head = this.buckets[index];

    // Check if key already exists in this chain to update it
    let current = head;
    while (current !== null) {
      if (current.key.toLowerCase() === String(key).toLowerCase()) {
        current.value = value;
        return;
      }
      current = current.next;
    }

    // New insertion
    if (head !== null) {
      this.collisionCount++;
    }

    const newNode = new HashNode(key, value, head);
    this.buckets[index] = newNode;
    this.size++;
  }

  /**
   * Retrieve value by key
   */
  get(key) {
    const index = this.hash(key);
    let current = this.buckets[index];
    const target = String(key).toLowerCase();

    let steps = 0;
    while (current !== null) {
      steps++;
      if (current.key.toLowerCase() === target) {
        return {
          found: true,
          value: current.value,
          bucketIndex: index,
          probeSteps: steps
        };
      }
      current = current.next;
    }

    return {
      found: false,
      value: null,
      bucketIndex: index,
      probeSteps: steps
    };
  }

  /**
   * Check if key exists
   */
  has(key) {
    return this.get(key).found;
  }

  /**
   * Return load factor alpha = N / M
   */
  getLoadFactor() {
    return (this.size / this.capacity).toFixed(2);
  }

  /**
   * Return inspection details for UI visualization
   */
  getInspectionData() {
    const bucketDetails = [];

    for (let i = 0; i < this.capacity; i++) {
      const chain = [];
      let current = this.buckets[i];
      while (current !== null) {
        chain.push({
          key: current.key,
          label: current.value?.name || current.value?.code || String(current.key),
          category: current.value?.category || 'general'
        });
        current = current.next;
      }

      bucketDetails.push({
        index: i,
        chainLength: chain.length,
        items: chain
      });
    }

    return {
      capacity: this.capacity,
      size: this.size,
      loadFactor: this.getLoadFactor(),
      collisionCount: this.collisionCount,
      buckets: bucketDetails
    };
  }
}
